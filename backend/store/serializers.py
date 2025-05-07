# backend/serializers.py
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import Category, SubCategory, SubSubcategory, Product, FavoriteProduct, Brand, SavedBrand, UserInteraction


CustomUser = get_user_model()  # Get the correct user model dynamically

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'password', 'password2', 'is_admin','is_brand']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_admin': {'required': False},  # Allow is_admin to be set optionally (default False)
            'is_brand': {'required': False},  # Allow is_brand to be set optionally (default False)
        }

    # def validate_email(self, value):
    #     if CustomUser.objects.filter(email=value).exists():
    #         raise serializers.ValidationError("A user with this email already exists.")
    #     return value

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
            is_brand=validated_data.get('is_brand', False),  # Default to False if not provided
        )
        return user




class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data


class UserSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = CustomUser
        fields = ['name', 'email', 'is_admin', 'is_brand']

# Brand Serializer
class BrandSerializer(serializers.ModelSerializer):
    # user = RegisterSerializer(read_only=True)

    class Meta:
        model = Brand
        fields = '__all__'

    def validate(self, data):
        # Only run this validation during creation
        if self.instance is None:  # This means we're creating, not updating
            if data.get('canadian_owned') is False and not data.get('origin_country'):
                raise serializers.ValidationError("Origin country must be specified if not Canadian owned.")
            if not data.get('disclaimer_agreed'):
                raise serializers.ValidationError("You must agree to the disclaimer before registering.")
        return data
       

    def create(self, validated_data):
        user = validated_data.pop("user")
        # user = CustomUser.objects.create_user(**user_data)
        brand = Brand.objects.create(user=user, **validated_data)
        return brand

    # def update(self, instance, validated_data):
    #     # Update user fields
    #     user_data = validated_data.pop("user", None)
    #     if user_data:
    #         instance.user.name = user_data.get("name", instance.user.name)
    #         instance.user.email = user_data.get("email", instance.user.email)
    #         instance.user.save()

    #     # Update brand fields
    #     instance.name = instance.user.name
    #     instance.email = instance.user.email
    #     # instance.registration = validated_data.get("registration", instance.registration)
    #     instance.category = validated_data.get("category", instance.category)
    #     instance.phone = validated_data.get("phone", instance.phone)
    #     instance.store_address = validated_data.get("store_address", instance.store_address)
    #     instance.supershop_store = validated_data.get("supershop_store", instance.supershop_store)
    #     instance.website_link = validated_data.get("website_link", instance.website_link)
    #     instance.province = validated_data.get("province", instance.province)
    #     instance.canadian_owned = validated_data.get("canadian_owned", instance.canadian_owned)
    #     instance.origin_country = validated_data.get("origin_country", instance.origin_country)
    #     instance.manufactured_in = validated_data.get("manufactured_in", instance.manufactured_in)
    #     instance.disclaimer_agreed = validated_data.get("disclaimer_agreed", instance.disclaimer_agreed)

    #     instance.save()
    #     return instance

class UserUpdateSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = CustomUser
        fields = ['name', 'email']

    # def validate_email(self, value):
    #     # Optionally add email validation logic (e.g., checking if it's unique)
    #     if CustomUser.objects.filter(email=value).exists():
    #         raise serializers.ValidationError("Email is already in use.")
    #     return value

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

class SubSubCategorySerializer(serializers.ModelSerializer):
    subcategory = SubCategorySerializer(read_only=True)  # Show full subcategory details

    class Meta:
        model = SubSubcategory
        fields = '__all__'
        
class ProductSerializer(serializers.ModelSerializer):
    # For write
    subcategory_id = serializers.PrimaryKeyRelatedField(
        queryset=SubCategory.objects.all(), source='subcategory', write_only=True
    )
    sub_subcategory_id = serializers.PrimaryKeyRelatedField(
        queryset=SubSubcategory.objects.all(), source='sub_subcategory', write_only=True
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False
    )

    # For read
    subcategory = SubCategorySerializer(read_only=True)  # Show full subcategory details
    sub_subcategory = SubSubCategorySerializer(read_only=True)
    computed_category = serializers.SerializerMethodField()  # Get category directly

    class Meta:
        model = Product
        fields = '__all__'

    def get_computed_category(self, obj):
        if obj.sub_subcategory and obj.sub_subcategory.subcategory and obj.sub_subcategory.subcategory.category:
            return {
                "id": obj.sub_subcategory.subcategory.category.id,
                "name": obj.sub_subcategory.subcategory.category.name
            }
        elif obj.subcategory and obj.subcategory.category:
            return {
                "id": obj.subcategory.category.id,
                "name": obj.subcategory.category.name
            }
        return None

    def create(self, validated_data):
        # Auto-fill category from subcategory if not provided
        if not validated_data.get('category') and validated_data.get('subcategory'):
            validated_data['category'] = validated_data['subcategory'].category

        # Set tags from raw input (if present)
        tags = self.initial_data.get('tags')
        if tags and isinstance(tags, list):
            validated_data['tags'] = tags

        return super().create(validated_data)

    def update(self, instance, validated_data):
        tags = self.initial_data.get('tags')
        if tags and isinstance(tags, list):
            validated_data['tags'] = tags

        return super().update(instance, validated_data)

class FavoriteProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavoriteProduct
        fields = '__all__'


class SavedBrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = SavedBrand
        fields = '__all__'

class UserInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInteraction
        fields = '__all__'
        
class ProductChatbotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'online_store']

class BrandChatbotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'website_link']

        