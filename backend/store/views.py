# backend/views.py
import logging
import re
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from store.authentication import CookieJWTAuthentication  # Import custom auth
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import RegisterSerializer, LoginSerializer, UserInteractionSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, UserSerializer, UserUpdateSerializer, PasswordUpdateSerializer, BrandSerializer, SavedBrandSerializer, CategorySerializer, SubCategorySerializer, SubSubCategorySerializer, ProductSerializer, FavoriteProductSerializer,BrandChatbotSerializer,ProductChatbotSerializer, CartSerializer, CartItemSerializer, OrderSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Category, SubCategory, SubSubcategory, Brand, SavedBrand, Product, FavoriteProduct, CustomUser, UserInteraction, Cart, CartItem, Order, OrderItem
from django.conf import settings
from django.http import JsonResponse
import jwt
from rest_framework.exceptions import AuthenticationFailed
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from django.core.mail import send_mail
from rest_framework import status
from datetime import datetime, timedelta
from django.utils.dateformat import DateFormat
from .llm_mistral import generate_recommendations, generate_tags_from_description, generate_chat_response
# import openai
import os
from rapidfuzz import fuzz


logger = logging.getLogger(__name__)


# Function to check health
def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "service": "shoplocal-backend"
    })


# Function to generate JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Function to check user authentication
def checkAuth(request):
        # Retrieve the token from cookies
        access_token = request.COOKIES.get("accessToken")
        logger.debug("access token present=%s", bool(access_token))

        if not access_token:
            raise AuthenticationFailed("No token found in cookies")

        try:
            # Decode the token
            payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
            logger.debug("decoded JWT for user_id=%s", payload.get("user_id"))
            user = CustomUser.objects.get(id=payload["user_id"])
            return user

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed("User not found")

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            remember_me = request.data.get("remember_me", False)

            user = authenticate(email=email, password=password)
            if user:
                tokens = get_tokens_for_user(user)
                response = Response({"user": {"id": user.id, "email": user.email, "name": user.name, "is_admin": user.is_admin, "is_brand": user.is_brand }}, status=status.HTTP_200_OK)

                max_age = 60*60*24*7 if remember_me else 60*60*24  # 7 days if remember me is checked, else 1 day
                
                response.set_cookie(
                    key="accessToken", 
                    value=tokens["access"],
                    max_age=max_age,
                    httponly=True, 
                    secure=True,  # Set to True in production with HTTPS
                    samesite="None"
                )
                response.set_cookie(
                    key="refreshToken", 
                    value=tokens["refresh"],
                    max_age=max_age,
                    httponly=True, 
                    secure=True, 
                    samesite="None"
                )
                return response

            return Response({"error": "Invalid credentials."}, status = status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=200)
        response.delete_cookie("accessToken")
        response.delete_cookie("refreshToken")
        return response



class CheckAuthView(APIView):
    def get(self, request):
        
        try:  
            # Use checkauth function to authenticate the user
            user = checkAuth(request)  
            logger.info("authenticated user checked user_id=%s", user.id)

            return Response({
                "authenticated": True,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "is_admin": user.is_admin,
                    "is_brand": user.is_brand,
                }
            }, status=200)

        except AuthenticationFailed as e:
            return Response({"authenticated": False, "error": str(e)}, status=401)
        except jwt.ExpiredSignatureError:
            return Response({"authenticated": False, "error": "Token expired"}, status=401)
        except jwt.InvalidTokenError:
            return Response({"authenticated": False, "error": "Invalid token"}, status=401)

class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            try:
                user = CustomUser.objects.get(email=email)
                payload = {
                    "user_id": user.id,
                    "exp": datetime.utcnow() + timedelta(minutes=30),
                    "iat": datetime.utcnow(),
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

                reset_url = f"http://localhost:3001/reset-password?token={token}"
                send_mail(
                    "Reset Your Password",
                    f"Click this link to reset your password: {reset_url}",
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                )
                return Response({"message": "Password reset link sent."})
            except User.DoesNotExist:
                return Response({"error": "No user found with this email."}, status=404)

        return Response(serializer.errors, status=400)


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data["token"]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user = CustomUser.objects.get(id=payload["user_id"])
                user.set_password(serializer.validated_data["new_password"])
                user.save()
                return Response({"message": "Password reset successful."})
            except jwt.ExpiredSignatureError:
                return Response({"error": "Token expired"}, status=400)
            except jwt.InvalidTokenError:
                return Response({"error": "Invalid token"}, status=400)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)

        return Response(serializer.errors, status=400)

# Get all Users
class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class UserProfileView(APIView):
    # GET request to fetch user data
    def get(self, request):
        user_data = checkAuth(request) # Custom function to check authentication
        if not user_data:
            return Response({"detail": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        user_id = user_data.id
        logger.info("fetching user profile user_id=%s", user_id)
        try:
            user = CustomUser.objects.get(id=user_id)
            serializer = UserSerializer(user)  # Serialize the user data
            logger.debug("user profile serialized user_id=%s", user_id)
            return Response(serializer.data)  # Return the serialized data as JSON
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        user_data = checkAuth(request)
        if not user_data:
            return Response({"detail": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        user_id = user_data.id
        logger.info("updating user profile user_id=%s", user_id)
        try:
            user = CustomUser.objects.get(id=user_id)
            serializer = UserUpdateSerializer(user, data=request.data, partial=True)  # partial=True allows partial updates (only name or email)
            
            if serializer.is_valid():
                serializer.save()  # Save the updated user data
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class PasswordUpdateView(APIView):
    def put(self, request):
        user_data = checkAuth(request)
        if not user_data:
            return Response({"detail": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        user_id = user_data.id
        logger.info("updating password user_id=%s", user_id)
        try:
            user = CustomUser.objects.get(id=user_id)
            serializer = PasswordUpdateSerializer(user, data=request.data, partial=True)  # partial=True allows partial updates (only name or email)
            
            if serializer.is_valid():
                serializer.save()  # Save the updated user data
                return Response({"detail": "Password updated successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class BrandView(APIView):
    def post(self, request):
        logger.info("brand registration request received")
        user_serializer = RegisterSerializer(data=request.data)
        if user_serializer.is_valid():
            # Check if the user already exists based on the email
            email = request.data.get('email')
            existing_user = CustomUser.objects.filter(email=email).first()
            logger.info("brand registration existing_user=%s", bool(existing_user))

            if existing_user:
                return Response({"message": "User with this email already exists!"}, status=status.HTTP_400_BAD_REQUEST)

            # Create the user if it doesn't exist
            user = user_serializer.save()

            # Now, prepare the brand data (exclude user-related data)
            brand_data = request.data.copy()  # Make a copy of the request data
            brand_data['user'] = user.id  # Set the user ID manually

            # Now pass the brand data to the BrandSerializer
            brand_serializer = BrandSerializer(data=brand_data)
            if brand_serializer.is_valid():
                brand_serializer.save(user=user)  # Save the brand
                return Response({"message": "Brand registered successfully!"}, status=status.HTTP_201_CREATED)
            return Response(brand_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        brands = Brand.objects.all()
        serializer = BrandSerializer(brands, many=True)
        return Response(serializer.data)

    # admin only
    def put(self, request, brand_id):

        user_data = checkAuth(request)
        logger.info("brand status update requested by user_id=%s", getattr(user_data, "id", None))
        if not user_data:
            return Response({"message": "Unauthorized. Admins only."}, status=status.HTTP_403_FORBIDDEN)

        action = request.data.get("status")
        if action not in ["Approved", "Declined"]:
            return Response({"message": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            brand = Brand.objects.get(id=brand_id)
        except Brand.DoesNotExist:
            return Response({"message": "Brand not found."}, status=status.HTTP_404_NOT_FOUND)

        if brand.status.lower() != "pending":
            return Response({"message": f"Brand already {brand.status}."}, status=status.HTTP_400_BAD_REQUEST)

        brand.status = "Approved" if action == "Approved" else "Rejected"
        brand.save()
        return Response({"message": f"Brand {brand.status.lower()} successfully."}, status=status.HTTP_200_OK)

    def patch(self, request, brand_id):
        """
        Partially update the brand details (not user details).
        Only brand-specific fields can be updated.
        """
        logger.info("brand update requested brand_id=%s", brand_id)
        try:
            brand = Brand.objects.get(id=brand_id)  # Get the brand by its ID
        except Brand.DoesNotExist:
            raise NotFound("Brand not found.")

        # Ensure the user cannot be modified (only brand fields are allowed)
        brand_serializer = BrandSerializer(brand, data=request.data, partial=True)

        if brand_serializer.is_valid():
            brand_serializer.save()  # Update brand fields
            return Response({"message": "Brand details updated successfully!"}, status=status.HTTP_200_OK)
        
        return Response(brand_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get all categories
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# Get all subcategories
class SubCategoryListView(generics.ListAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

# Get all sub_subcategories
class SubSubCategoryListView(generics.ListAPIView):
    queryset = SubSubcategory.objects.all()
    serializer_class = SubSubCategorySerializer


# Get all products
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# Add Products
class ProductView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def get(self, request, product_id):
        logger.info("product detail requested product_id=%s", product_id)

        try:
            product = (
                Product.objects
                .select_related("category", "subcategory", "sub_subcategory", "brand_id")
                .get(id=product_id)
            )
        except Product.DoesNotExist:
            return Response({"message": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = checkAuth(request)
        # Get the user ID from the request (assuming user is authenticated)
        logger.info("product create requested user_id=%s", user.id)
        
        # Add the user explicitly to the request data
        request.data['user'] = user.id

        # Get tags as list
        if isinstance(request.data.get("tags"), str):
            request.data["tags"] = [tag.strip() for tag in request.data["tags"].split(",") if tag.strip()]
       
        # Serialize the incoming data and validate it
       
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            logger.info("product created product_id=%s user_id=%s", product.id, user.id)
            return Response({"message": "Product added successfully!"}, status=status.HTTP_201_CREATED)
        else:
            logger.warning("product create validation failed user_id=%s errors=%s", user.id, serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, product_id):
        user = checkAuth(request)
        logger.info("product update requested product_id=%s user_id=%s", product_id, user.id)

        try:
            product = Product.objects.get(id=product_id, user=user)
        except Product.DoesNotExist:
            return Response({"message": "Product not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

        # Normalize tags if passed as comma-separated string
        tags = request.data.get("tags")
        if isinstance(tags, str):
            request.data["tags"] = [tag.strip() for tag in tags.split(",") if tag.strip()]

        # Explicitly preserve the user on update (in case it's not in data)
        request.data["user"] = user.id

        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info("product updated product_id=%s user_id=%s", product_id, user.id)
            return Response({"message": "Product updated successfully!"}, status=status.HTTP_200_OK)
        else:
            logger.warning("product update validation failed product_id=%s user_id=%s errors=%s", product_id, user.id, serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Approve/ Reject Products(admin only)
    def put(self, request, product_id):

        user_data = checkAuth(request)
        logger.info("product status update requested product_id=%s user_id=%s", product_id, getattr(user_data, "id", None))
        if not user_data:
            return Response({"message": "Unauthorized. Admins only."}, status=status.HTTP_403_FORBIDDEN)

        action = request.data.get("status")
        if action not in ["Approved", "Declined"]:
            return Response({"message": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"message": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        if product.status.lower() != "pending":
            return Response({"message": f"Product already {product.status}."}, status=status.HTTP_400_BAD_REQUEST)

        product.status = "Approved" if action == "Approved" else "Rejected"
        product.save()
        return Response({"message": f"Product {product.status.lower()} successfully."}, status=status.HTTP_200_OK)

    # Trash/Restore product
    def patch(self, request, product_id):
        user_data = checkAuth(request)
        
        if not user_data:
            return Response({"message": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)
        logger.info("product trash toggle requested product_id=%s user_id=%s", product_id, user_data.id)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"message": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        product.is_trashed = not product.is_trashed
        product.save()
        return Response({"message": f"Product trashed successfully."}, status=status.HTTP_200_OK)



# Add Products to favourites
class FavoriteProductView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        # user = request.user
        user = checkAuth(request)
        user_id = user.id
        logger.info("favorite product add requested user_id=%s", user.id)
        
        # Extract product ID from the request data
        product_id = request.data.get("product")
        logger.debug("favorite product requested product_id=%s user_id=%s", product_id, user_id)
        # Check if the product is already in the user's favorites
        if FavoriteProduct.objects.filter(user_id=user_id, product_id=product_id).exists():
            return Response(
                {"message": "This product is already in your favorites!"},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Serialize the incoming data and validate it
        request.data['user'] = user_id
        serializer = FavoriteProductSerializer(data=request.data)
        if serializer.is_valid():
            fav_product = serializer.save()
            return Response({"message": "Product added to favorites successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def get(self, request):
        # Get the user ID from the checkAuth function
        # user = request.user
        user = checkAuth(request)
        user_id = user.id
        
        # Get all the favorite products for the user
        favorites = FavoriteProduct.objects.filter(user_id=user_id).values_list("product_id", flat=True)
        logger.debug("favorites fetched user_id=%s", user_id)
        products = Product.objects.filter(id__in = favorites)
        logger.debug("favorite products serialized user_id=%s count=%s", user_id, products.count())
        # Serialize the products matching id
        serializer = ProductSerializer(products, many=True)
        
        # Return the list of favorite products
        return Response({"favorites": serializer.data}, status=status.HTTP_200_OK)

    def delete(self, request, product_id):
        # Get the user ID from the request (again, assuming user is authenticated)
        # user = request.user
        user = checkAuth(request)
        user_id = user.id
        logger.info("favorite product remove requested user_id=%s product_id=%s", user_id, product_id)
        
        try:
            # Find the favorite product by user and product ID
            favourite_product = FavoriteProduct.objects.get(user_id=user_id, product_id=product_id)
            
            # Delete the favorite product
            favourite_product.delete()
            
            return Response({"message": "Product removed from favorites successfully!"}, status=status.HTTP_204_NO_CONTENT)
        
        except FavoriteProduct.DoesNotExist:
            return Response({"error": "Favorite product not found"}, status=status.HTTP_404_NOT_FOUND)

# Add Brand to saved collection
class SavedBrandView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        user = checkAuth(request)
        # Get the user ID from the request (assuming user is authenticated)
        user_id = user.id
        logger.info("saved brand add requested user_id=%s", user.id)
        
        # Extract brand ID from the request data
        brand_id = request.data.get("brand")
        logger.debug("saved brand requested brand_id=%s user_id=%s", brand_id, user_id)
        # Check if the brand is already in the user's saved collection
        if SavedBrand.objects.filter(user_id=user_id, brand_id=brand_id).exists():
            return Response(
                {"message": "This brand is already in your saved collection!"},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Serialize the incoming data and validate it
        request.data['user'] = user_id
        serializer = SavedBrandSerializer(data=request.data)
        if serializer.is_valid():
            saved_brand = serializer.save()
            return Response({"message": "Brand saved successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def get(self, request):
        # Get the user ID from the checkAuth function
        user = checkAuth(request)
        user_id = user.id
        
        # Get all the saved brands for the user
        saved_brands = SavedBrand.objects.filter(user_id=user_id).values_list("brand_id", flat=True)
        logger.debug("saved brands fetched user_id=%s", user_id)
        brands = Brand.objects.filter(id__in = saved_brands)
        logger.debug("saved brands serialized user_id=%s count=%s", user_id, brands.count())
        # Serialize the brands matching id
        serializer = BrandSerializer(brands, many=True)
        
        # Return the list of saved brands
        return Response({"saved_brands": serializer.data}, status=status.HTTP_200_OK)

    def delete(self, request, brand_id):
        # Get the user ID from the request (again, assuming user is authenticated)
        user = checkAuth(request)
        user_id = user.id
        logger.info("saved brand remove requested user_id=%s brand_id=%s", user_id, brand_id)
        # user_id =  request.data.get('user') # Get the user ID
        
        try:
            # Find the saved brand by user and brand ID
            saved_brand = SavedBrand.objects.get(user_id=user_id, brand_id=brand_id)
            
            # Delete the Saved brand
            saved_brand.delete()
            
            return Response({"message": "Brands removed from saved collection successfully!"}, status=status.HTTP_204_NO_CONTENT)
        
        except SavedBrand.DoesNotExist:
            return Response({"error": "Saved brand not found"}, status=status.HTTP_404_NOT_FOUND)



class LogInteractionView(APIView):
    def post(self, request):
        logger.info("user interaction log requested action=%s user=%s", request.data.get("action"), request.data.get("user"))
        serializer = UserInteractionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Interaction logged!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LLMRecommendationView(APIView):
    def get(self, request):
        user = checkAuth(request)
        if not user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        logger.info("recommendations requested user_id=%s", user.id)

        interactions = UserInteraction.objects.filter(user_id=user.id).order_by('-timestamp')[:10]
        logger.debug("recommendation interactions retrieved user_id=%s count=%s", user.id, len(interactions))

        tags = []

        for i in interactions:
            logger.debug("recommendation interaction action=%s has_query=%s has_product=%s", i.action, bool(i.search_query), bool(i.product))
            
            # Add search query if available
            if i.search_query:
                cleaned_query = i.search_query.strip().lower()
                if cleaned_query:
                    tags.append(cleaned_query)

            # Add product tags if available
            if i.product and getattr(i.product, 'tags', None):
                raw_tags = i.product.tags
                if isinstance(raw_tags, str):
                    tags.extend([t.strip().lower() for t in raw_tags.split(",") if t.strip()])
                elif isinstance(raw_tags, list):
                    tags.extend([t.strip().lower() for t in raw_tags if isinstance(t, str)])

        logger.debug("recommendation extracted tag_count=%s", len(tags))

        # Final keyword set
        keywords = list(set(tags))[:5]
        logger.info("recommendation keywords selected user_id=%s keywords=%s", user.id, keywords)

        # Optional fallback if no meaningful tags found
        if not keywords:
            keywords = ["popular", "electronics", "new"]
            logger.info("recommendation fallback keywords used user_id=%s", user.id)

        try:
            results = generate_recommendations(keywords)
            logger.info("recommendations generated user_id=%s count=%s", user.id, len(results))
            return Response({"recommendations": results})
        except Exception as e:
            logger.exception("recommendation generation failed user_id=%s", user.id)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateTagsFromDescriptionView(APIView):
    def post(self, request):
        desc = request.data.get("text", "")
        if not desc:
            return Response({"error": "No description provided"}, status=status.HTTP_400_BAD_REQUEST)

        tags = generate_tags_from_description(desc)
        return Response({"tags": tags})

# openai.api_key = os.getenv("OPENAI_API_KEY")

STOP_WORDS = {
    "a", "an", "and", "are", "below", "budget", "can", "find", "for", "get",
    "give", "i", "in", "is", "less", "looking", "me", "need", "of", "please",
    "product", "products", "show", "than", "the", "to", "under", "within",
    "with", "you"
}

KNOWN_COLORS = {
    "black", "white", "red", "blue", "green", "yellow", "pink", "purple",
    "brown", "gray", "grey", "silver", "gold", "orange", "beige"
}


def parse_chatbot_product_query(message):
    text = (message or "").lower()
    filters = {
        "raw": text,
        "keywords": [],
        "tags": [],
        "min_price": None,
        "max_price": None,
    }

    between_match = re.search(r"between\s+\$?(\d+(?:\.\d+)?)\s+(?:and|to)\s+\$?(\d+(?:\.\d+)?)", text)
    if between_match:
        filters["min_price"] = min(float(between_match.group(1)), float(between_match.group(2)))
        filters["max_price"] = max(float(between_match.group(1)), float(between_match.group(2)))
    else:
        max_match = re.search(r"(?:under|below|within|less than|up to)\s+\$?(\d+(?:\.\d+)?)", text)
        if max_match:
            filters["max_price"] = float(max_match.group(1))

    words = re.findall(r"[a-zA-Z0-9]+", text)
    for word in words:
        if word in KNOWN_COLORS:
            filters["tags"].append(word)
        elif word not in STOP_WORDS and not word.isdigit() and len(word) > 1:
            filters["keywords"].append(word)

    filters["keywords"] = list(dict.fromkeys(filters["keywords"]))
    filters["tags"] = list(dict.fromkeys(filters["tags"]))
    return filters


def search_products_for_chatbot(filters, limit=5):
    products = Product.objects.filter(is_trashed=False).select_related("category", "subcategory", "sub_subcategory", "brand_id")
    products = products.exclude(status__iexact="Rejected").exclude(status__iexact="Pending")

    if filters.get("min_price") is not None:
        products = products.filter(price__gte=filters["min_price"])
    if filters.get("max_price") is not None:
        products = products.filter(price__lte=filters["max_price"])

    search_terms = filters.get("keywords", []) + filters.get("tags", [])
    if search_terms:
        query = Q()
        for term in search_terms:
            query |= Q(name__icontains=term)
            query |= Q(description__icontains=term)
            query |= Q(tags__icontains=term)
            query |= Q(category__name__icontains=term)
            query |= Q(subcategory__name__icontains=term)
            query |= Q(sub_subcategory__name__icontains=term)
            query |= Q(brand_id__name__icontains=term)
        products = products.filter(query).distinct()

    return products.order_by("price", "-created_at")[:limit]

class ChatbotAPIView(APIView):
    def post(self, request):
        logger.info("chatbot request received")
        user_message = request.data.get("message", "").lower()

        filters = parse_chatbot_product_query(user_message)
        smart_products = search_products_for_chatbot(filters)
        if smart_products.exists():
            product_data = ProductChatbotSerializer(smart_products, many=True).data
            return Response({
                "type": "suggestions",
                "products": product_data,
                "brands": [],
                "message": "Here are products matching your request."
            })

        # Exact/partial match
        matched_products = Product.objects.filter(name__icontains=user_message, is_trashed=False)
        matched_brands = Brand.objects.filter(name__icontains=user_message)

        # If no matches found, try fuzzy logic
        if not matched_products.exists():
            all_products = Product.objects.filter(is_trashed=False)
            for product in all_products:
                if fuzz.partial_ratio(user_message, product.name.lower()) > 80:
                    matched_products = matched_products | Product.objects.filter(id=product.id)

        if not matched_brands.exists():
            all_brands = Brand.objects.all()
            for brand in all_brands:
                if fuzz.partial_ratio(user_message, brand.name.lower()) > 80:
                    matched_brands = matched_brands | Brand.objects.filter(id=brand.id)

        # Return results if any
        if matched_products.exists() or matched_brands.exists():
            product_data = ProductChatbotSerializer(matched_products.distinct()[:5], many=True).data
            brand_data = BrandChatbotSerializer(matched_brands.distinct()[:5], many=True).data
            return Response({
                "type": "suggestions",
                "products": product_data,
                "brands": brand_data,
                "message": "Here are some suggestions from our database."
            })

        # Fallback to product-vector recommendations before plain chat text.
        try:
            recommendation_terms = filters.get("keywords") or filters.get("tags") or [user_message]
            recommended_items = generate_recommendations(recommendation_terms)
            recommended_ids = [item.get("id") for item in recommended_items if item.get("id")]

            if recommended_ids:
                preserved_order = {product_id: index for index, product_id in enumerate(recommended_ids)}
                recommended_products = list(
                    Product.objects.filter(
                        id__in=recommended_ids,
                        is_trashed=False
                    )
                    .exclude(status__iexact="Rejected")
                    .exclude(status__iexact="Pending")
                    .select_related("category", "subcategory", "sub_subcategory", "brand_id")
                )
                recommended_products.sort(key=lambda product: preserved_order.get(product.id, 999))

                if recommended_products:
                    product_data = ProductChatbotSerializer(recommended_products[:5], many=True).data
                    return Response({
                        "type": "suggestions",
                        "products": product_data,
                        "brands": [],
                        "message": "I found a few relevant products for you."
                    })
        except Exception as e:
            logger.exception("chatbot product recommendation fallback failed: %s", e)

        # Fallback to LLM-generated RAG response
        ai_reply = generate_chat_response(user_message)
        return Response({"type": "chat", "message": ai_reply})

        # If nothing matched
        # return Response({
        #     "type": "fallback",
        #     "message": "Sorry, I couldn’t find anything matching your request."
        # }, status=200)

        # # If no DB matches, fallback to OpenAI
        # try:
        #     response = openai.ChatCompletion.create(
        #         model="gpt-3.5-turbo",
        #         messages=[
        #             {"role": "system", "content": "You are a helpful assistant for a local shopping website."},
        #             {"role": "user", "content": user_message}
        #         ]
        #     )
        #     ai_reply = response['choices'][0]['message']['content']
        #     return Response({"type": "chat", "message": ai_reply})
        # except Exception as e:
        #     return Response({
        #         "type": "fallback",
        #         "message": "Sorry, I couldn’t process your request. Please try again later."
        #     }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BrandAnalyticsView(APIView):
    def get(self, request):
     
        user = checkAuth(request)
        if not user:
            return Response({"error": "Unauthorized"}, status=401)

        try:
            brand = Brand.objects.get(user=user)
            logger.info("brand analytics requested brand_id=%s user_id=%s", brand.id, user.id)
        except Brand.DoesNotExist:
            return Response({"error": "Brand not found"}, status=404)
       

        this_month = datetime.now().month

        products = Product.objects.filter(brand_id=brand.id, is_trashed=False)
        logger.debug("brand analytics products loaded brand_id=%s count=%s", brand.id, products.count())
        interactions = UserInteraction.objects.filter(product__in=products)


        monthly_data = products.annotate(
            month=TruncMonth("created_at")
        ).values("month").annotate(
            count=Count("id")
        ).order_by("month")

        # Format the month for the response
        monthly_products = [
            {"month": DateFormat(item["month"]).format("F Y"), "count": item["count"]}
            for item in monthly_data
            ]

        status = products.values("status").annotate(count=Count("id"))
        logger.debug("brand analytics product status loaded brand_id=%s", brand.id)

      # Aggregate analytics
        data = {
            "most_viewed": interactions.filter(action="view")
                .values("product__name")
                .annotate(total=Count("id"))
                .order_by("-total")[:5],

            "most_clicked": interactions.filter(action="click")
                .values("product__name")
                .annotate(total=Count("id"))
                .order_by("-total")[:5],

            "most_searched": interactions.filter(action="search")
                .values("search_query")
                .annotate(total=Count("id"))
                .order_by("-total")[:5],

            "monthly_products" : monthly_products,

            "status_count": products
                .values("status")
                .annotate(count=Count("id")),
        }

        return Response(data)

class AdminAnalyticsView(APIView):
    def get(self, request):
        user = checkAuth(request)
        if not user:
            return Response({"error": "Unauthorized"}, status=401)
        data = {
                # Number of products each brand has
                "brands_product_count": Brand.objects.annotate(
                    product_count=Count("products")
                ).values("name", "product_count"),

                # Approved vs. rejected brands
                "approved_vs_rejected_brands": {
                    "approved": Brand.objects.filter(status="Approved").count(),
                    "rejected": Brand.objects.filter(status="Rejected").count()
                },

                # Number of products in each category
                "products_by_category": Category.objects.annotate(
                    count=Count("products")
                ).values("name", "count"),

                # Top 5 most viewed categories
                "most_viewed_categories": UserInteraction.objects.filter(action="view")
                    .values("product__category__name")
                    .annotate(count=Count("id"))
                    .order_by("-count")[:5],

                # Top 5 most viewed brands
                "most_viewed_brands": UserInteraction.objects.filter(action="view")
                    .values("product__brand_id__name")
                    .annotate(count=Count("id"))
                    .order_by("-count")[:5],

                # Product counts by brand (general)
                "products_by_brand": Product.objects.values("brand_id__name")
                    .annotate(count=Count("id"))
                    .order_by("-count"),
            }

        return Response(data)


class CartView(APIView):
    def get(self, request):
        user = checkAuth(request)
        cart, _ = Cart.objects.get_or_create(user=user)
        serializer = CartSerializer(cart)
        logger.info("cart fetched user_id=%s cart_id=%s", user.id, cart.id)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartItemView(APIView):
    def post(self, request):
        user = checkAuth(request)
        product_id = request.data.get("product")
        quantity = request.data.get("quantity", 1)

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response({"quantity": ["Quantity must be a valid number."]}, status=status.HTTP_400_BAD_REQUEST)

        if quantity < 1:
            return Response({"quantity": ["Quantity must be at least 1."]}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"product": ["Product not found."]}, status=status.HTTP_404_NOT_FOUND)

        if product.is_trashed:
            return Response({"product": ["This product is not available."]}, status=status.HTTP_400_BAD_REQUEST)

        if product.price is None:
            return Response({"product": ["This product does not have a price."]}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={
                "quantity": quantity,
                "unit_price": product.price,
            },
        )

        if not created:
            return Response(
                {"message": "This product is already in your cart!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CartItemSerializer(cart_item)
        logger.info(
            "cart item added user_id=%s cart_id=%s product_id=%s quantity=%s created=%s",
            user.id,
            cart.id,
            product.id,
            quantity,
            created,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def patch(self, request, item_id):
        user = checkAuth(request)
        quantity = request.data.get("quantity")

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response({"quantity": ["Quantity must be a valid number."]}, status=status.HTTP_400_BAD_REQUEST)

        if quantity < 1:
            return Response({"quantity": ["Quantity must be at least 1."]}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=user)
        except CartItem.DoesNotExist:
            return Response({"message": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        cart_item.quantity = quantity
        cart_item.save(update_fields=["quantity", "updated_at"])

        serializer = CartItemSerializer(cart_item)
        logger.info("cart item updated user_id=%s item_id=%s quantity=%s", user.id, item_id, quantity)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        user = checkAuth(request)

        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=user)
        except CartItem.DoesNotExist:
            return Response({"message": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        logger.info("cart item removed user_id=%s item_id=%s", user.id, item_id)
        return Response({"message": "Cart item removed successfully."}, status=status.HTTP_204_NO_CONTENT)


class CartClearView(APIView):
    def delete(self, request):
        user = checkAuth(request)
        cart, _ = Cart.objects.get_or_create(user=user)
        deleted_count, _ = cart.items.all().delete()
        logger.info("cart cleared user_id=%s cart_id=%s deleted_count=%s", user.id, cart.id, deleted_count)
        return Response({"message": "Cart cleared successfully."}, status=status.HTTP_204_NO_CONTENT)


class OrderCheckoutView(APIView):
    def post(self, request):
        user = checkAuth(request)
        cart, _ = Cart.objects.get_or_create(user=user)
        items = list(cart.items.select_related("product", "product__brand_id").all())

        if not items:
            return Response({"message": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        customer_name = request.data.get("customer_name") or user.name
        customer_email = request.data.get("customer_email") or user.email
        fulfillment_method = request.data.get("fulfillment_method") or "Pickup"
        address = request.data.get("address", "")
        notes = request.data.get("notes", "")

        subtotal = cart.subtotal
        order = Order.objects.create(
            user=user,
            customer_name=customer_name,
            customer_email=customer_email,
            fulfillment_method=fulfillment_method,
            address=address,
            notes=notes,
            subtotal=subtotal,
            total=subtotal,
        )

        for item in items:
            product = item.product
            brand = product.brand_id
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_image=product.image,
                brand=brand,
                brand_name=brand.name if brand else None,
                quantity=item.quantity,
                unit_price=item.unit_price,
                line_total=item.line_total,
            )

        cart.items.all().delete()
        logger.info("order created user_id=%s order_id=%s item_count=%s", user.id, order.id, len(items))
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderListView(APIView):
    def get(self, request):
        user = checkAuth(request)
        if user.is_admin:
            orders = Order.objects.all()
        elif user.is_brand:
            try:
                brand = Brand.objects.get(user=user)
                orders = Order.objects.filter(items__brand=brand).distinct()
            except Brand.DoesNotExist:
                orders = Order.objects.none()
        else:
            orders = Order.objects.filter(user=user)

        orders = orders.prefetch_related("items").order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderDetailView(APIView):
    def get(self, request, order_id):
        user = checkAuth(request)

        try:
            if user.is_admin:
                order = Order.objects.get(id=order_id)
            elif user.is_brand:
                brand = Brand.objects.get(user=user)
                order = Order.objects.filter(id=order_id, items__brand=brand).distinct().get()
            else:
                order = Order.objects.get(id=order_id, user=user)
        except (Order.DoesNotExist, Brand.DoesNotExist):
            return Response({"message": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderStatusView(APIView):
    def patch(self, request, order_id):
        user = checkAuth(request)

        if not user.is_admin and not user.is_brand:
            return Response({"message": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)

        next_status = request.data.get("status")
        valid_statuses = {choice[0] for choice in Order.STATUS_CHOICES}
        if next_status not in valid_statuses:
            return Response({"message": "Invalid order status."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if user.is_admin:
                order = Order.objects.get(id=order_id)
            else:
                brand = Brand.objects.get(user=user)
                order = Order.objects.filter(id=order_id, items__brand=brand).distinct().get()
        except (Order.DoesNotExist, Brand.DoesNotExist):
            return Response({"message": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        order.status = next_status
        order.save(update_fields=["status", "updated_at"])
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
