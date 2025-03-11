# backend/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import RegisterSerializer, LoginSerializer, CategorySerializer, SubCategorySerializer, ProductSerializer, FavoriteProductSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Category, SubCategory, Product, FavoriteProduct



# Function to generate JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

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
                return Response({"tokens": tokens, "user": {"id": user.id, "email": user.email, "name": user.name}}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials."}, status = status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get all categories
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Get all subcategories
class SubCategoryListView(generics.ListAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

# Get all products
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# Add Products to favourites
class FavoriteProductView(APIView):
    def post(self, request):
        print("Incoming Request Data:", request.data)
        # Get the user ID from the request (assuming user is authenticated)
        user_id = request.data.get('user')
        
        # Extract product ID from the request data
        product_id = request.data.get("product")
        
        # Check if the product is already in the user's favorites
        if FavoriteProduct.objects.filter(user_id=user_id, product_id=product_id).exists():
            return Response(
                {"message": "This product is already in your favorites!"},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Serialize the incoming data and validate it
        serializer = FavoriteProductSerializer(data=request.data)
        if serializer.is_valid():
            fav_product = serializer.save()
            return Response({"message": "Product added to favorites successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def get(self, request):
        # Get the user ID from the request (can be obtained via authentication token or session)
        user_id = request.data.get('user')  # Assuming the user is authenticated and we get their ID
        
        # Get all the favorite products for the user
        favorites = FavoriteProduct.objects.filter(user_id=user_id)
        
        # Serialize the favorites
        serializer = FavoriteProductSerializer(favorites, many=True)
        
        # Return the list of favorite products
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, product_id):
        # Get the user ID from the request (again, assuming user is authenticated)
        user_id =  request.data.get('user') # Get the user ID
        
        try:
            # Find the favorite product by user and product ID
            favourite_product = FavoriteProduct.objects.get(user_id=user_id, product_id=product_id)
            
            # Delete the favorite product
            favourite_product.delete()
            
            return Response({"message": "Product removed from favorites successfully!"}, status=status.HTTP_204_NO_CONTENT)
        
        except FavoriteProduct.DoesNotExist:
            return Response({"error": "Favorite product not found"}, status=status.HTTP_404_NOT_FOUND)