# backend/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from store.authentication import CookieJWTAuthentication  # Import custom auth
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import RegisterSerializer, LoginSerializer, UserInteractionSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, UserSerializer, UserUpdateSerializer, PasswordUpdateSerializer, BrandSerializer, SavedBrandSerializer, CategorySerializer, SubCategorySerializer, SubSubCategorySerializer, ProductSerializer, FavoriteProductSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Category, SubCategory, SubSubcategory, Brand, SavedBrand, Product, FavoriteProduct, CustomUser, UserInteraction
from django.conf import settings
import jwt
from rest_framework.exceptions import AuthenticationFailed
from django.core.mail import send_mail
from rest_framework import status
from datetime import datetime, timedelta
from .llm_mistral import generate_recommendations



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
        print("Access Token", access_token)

        if not access_token:
            return Response({"authenticated": False, "error": "No token found in cookies"}, status=401)

        try:
            # Decode the token
            payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
            print("Decoded Payload:", payload)
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
            user = authenticate(email=email, password=password)
            if user:
                tokens = get_tokens_for_user(user)
                response = Response({"user": {"id": user.id, "email": user.email, "name": user.name, "is_admin": user.is_admin, "is_brand": user.is_brand }}, status=status.HTTP_200_OK)
                response.set_cookie(
                    key="accessToken", 
                    value=tokens["access"], 
                    httponly=True, 
                    secure=False,  # Set to True in production with HTTPS
                    samesite="Lax"
                )
                response.set_cookie(
                    key="refreshToken", 
                    value=tokens["refresh"], 
                    httponly=True, 
                    secure=False, 
                    samesite="Lax"
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
            print("Authenticated User:", user)

            return Response({
                "authenticated": True,
                "user": {"id": user.id, "email": user.email, "name": user.name}  # Using `user.name` instead of `username`
            }, status=200)

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
        print(user_id)
        try:
            user = CustomUser.objects.get(id=user_id)
            serializer = UserSerializer(user)  # Serialize the user data
            print("User data:", serializer.data)
            return Response(serializer.data)  # Return the serialized data as JSON
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        user_data = checkAuth(request)
        if not user_data:
            return Response({"detail": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        user_id = user_data.id
        print(user_id)
        try:
            user = CustomUser.objects.get(id=user_id)
            serializer = UserUpdateSerializer(user, data=request.data, partial=True)  # partial=True allows partial updates (only name or email)
            
            if serializer.is_valid():
                # print("User data:", serializer.data)
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
        print(user_id)
        try:
            user = CustomUser.objects.get(id=user_id)
            serializer = PasswordUpdateSerializer(user, data=request.data, partial=True)  # partial=True allows partial updates (only name or email)
            
            if serializer.is_valid():
                # print("User data:", serializer.data)
                serializer.save()  # Save the updated user data
                return Response({"detail": "Password updated successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class BrandView(APIView):
    def post(self, request):
        print("Request Data:", request.data)
        user_serializer = RegisterSerializer(data=request.data)
        if user_serializer.is_valid():
            # Check if the user already exists based on the email
            email = request.data.get('email')
            existing_user = CustomUser.objects.filter(email=email).first()
            print("Existing User", existing_user)

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
        print("User Data", user_data)
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
        print(brand_id)
        print(request.data)
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
    def post(self, request):
        user = checkAuth(request)
        # Get the user ID from the request (assuming user is authenticated)
        print("User Id: ", user.id)
        print("Incoming Request Data:", request.data)
        
        # Add the user explicitly to the request data
        request.data['user'] = user.id
        print(request.data)
       
        # Serialize the incoming data and validate it
       
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            return Response({"message": "Product added successfully!"}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Log the errors to the console
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Approve/ Reject Products(admin only)
    def put(self, request, product_id):

        user_data = checkAuth(request)
        print("User Data", user_data)
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


# Add Products to favourites
class FavoriteProductView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        user = checkAuth(request)
        # Get the user ID from the request (assuming user is authenticated)
        user_id = user.id
        print("User Id: ", user.id)
        print("Incoming Request Data:", request.data)
        
        # Extract product ID from the request data
        product_id = request.data.get("product")
        print("Product Id:", product_id)
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
        user = checkAuth(request)
        user_id = user.id
        
        # Get all the favorite products for the user
        favorites = FavoriteProduct.objects.filter(user_id=user_id).values_list("product_id", flat=True)
        print("Favorites", favorites)
        products = Product.objects.filter(id__in = favorites)
        print("Products", products)
        # Serialize the products matching id
        serializer = ProductSerializer(products, many=True)
        
        # Return the list of favorite products
        return Response({"favorites": serializer.data}, status=status.HTTP_200_OK)

    def delete(self, request, product_id):
        # Get the user ID from the request (again, assuming user is authenticated)
        user = checkAuth(request)
        print("User", user)
        user_id = user.id
        # user_id =  request.data.get('user') # Get the user ID
        
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
        print("User Id: ", user.id)
        print("Incoming Request Data:", request.data)
        
        # Extract brand ID from the request data
        brand_id = request.data.get("brand")
        print("Brand Id:", brand_id)
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
        print("Saved Brands", saved_brands)
        brands = Brand.objects.filter(id__in = saved_brands)
        print("Brands", brands)
        # Serialize the brands matching id
        serializer = BrandSerializer(brands, many=True)
        
        # Return the list of saved brands
        return Response({"saved_brands": serializer.data}, status=status.HTTP_200_OK)

    def delete(self, request, brand_id):
        # Get the user ID from the request (again, assuming user is authenticated)
        user = checkAuth(request)
        print("User", user)
        user_id = user.id
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
        serializer = UserInteractionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Interaction logged!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LLMRecommendationView(APIView):
    def get(self, request):
        user = request.user
        interactions = UserInteraction.objects.filter(user=user).order_by('-timestamp')[:10]
        tags = []
        for i in interactions:
            if i.search_query:
                tags.append(i.search_query)
            if i.product and i.product.tags:
                tags.extend(i.product.tags)
        keywords = list(set(tags))[:5]
        try:
            results = generate_recommendations(keywords)
            return Response({"recommendations": results})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)