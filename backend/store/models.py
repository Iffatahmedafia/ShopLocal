from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        """
        Create and return a superuser with an email, name, and password.
        """
        extra_fields.setdefault('is_admin', True)

        return self.create_user(email, name, password, **extra_fields)

# Create your models here.
class CustomUser(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)  # Email field as unique
    name = models.CharField(max_length=255) 
    is_admin = models.BooleanField(default=False)  # Custom isAdmin field

       # Use the custom user manager
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'  # Set email as the unique identifier for the user
    REQUIRED_FIELDS = ['name']  # 'name' is required but 'username' is not.

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        return self.is_admin

# Create Category model
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)


    def __str__(self):
        return self.name

class SubCategory(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
   

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)  # Store brand name
    price = models.DecimalField(max_digits=10, decimal_places=2)
    offline_store = models.TextField(blank=True, null=True)
    online_store = models.URLField(max_length=500, blank=True, null=True)  # Store URL
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name="products")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="products")

    def __str__(self):
        return self.name

class FavoriteProduct(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="favorites")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="favorited_by")

    class Meta:
        unique_together = ('user', 'product')

