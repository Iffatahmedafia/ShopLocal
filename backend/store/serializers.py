# backend/serializers.py
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import Category, SubCategory, Product, FavoriteProduct


CustomUser = get_user_model()  # Get the correct user model dynamically

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'password', 'password2', 'is_admin']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_admin': {'required': False},  # Allow is_admin to be set optionally (default False)
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')  # Remove password2 before saving
        user = CustomUser.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_admin=validated_data.get('is_admin', False),  # Default to False if not provided
        )
        return user




class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = CustomUser
        fields = ['name', 'email', 'is_admin']

class UserUpdateSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = CustomUser
        fields = ['name', 'email']

        def validate_email(self, value):
            # Optionally add email validation logic (e.g., checking if it's unique)
            if CustomUser.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email is already in use.")
            return value

class PasswordUpdateSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.instance  # Get the user instance passed in `serializer = PasswordUpdateSerializer(user, data=request.data)`

        # Check if old password matches
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError({"old_password": "Old password is incorrect."})

        return data

    def update(self, instance, validated_data):
        instance.password = make_password(validated_data['new_password'])  # Hash the new password
        instance.save()
        return instance


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'  # Include all fields

class SubCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)  # Show full category details

    class Meta:
        model = SubCategory
        fields = '__all__'
        
class ProductSerializer(serializers.ModelSerializer):
    subcategory = SubCategorySerializer(read_only=True)  # Show full subcategory details
    category = serializers.SerializerMethodField()  # Get category directly

    class Meta:
        model = Product
        fields = '__all__'

    def get_category(self, obj):
        return obj.subcategory.category.name  # Get category name from subcategory

class FavoriteProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavoriteProduct
        fields = '__all__'
        