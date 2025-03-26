from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    is_brand = models.BooleanField(default=False)

    # Set a default value for 'username' field to prevent conflicts
    username = models.CharField(max_length=255, unique=True, blank=True, null=True)

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
    image = models.CharField(max_length=255, default='images/default.jpg')  # Set default image

    def __str__(self):
        return self.name

class Brand(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="Brand")
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    registration = models.CharField(max_length=255, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    website_link = models.URLField(max_length=500, blank=True, null=True)  # Store URL
    province = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name
# Signal to keep Brand's name and email in sync with CustomUser
@receiver(post_save, sender=CustomUser)
def update_brand_info(sender, instance, **kwargs):
    if hasattr(instance, 'brand'):
        instance.brand.name = instance.name
        instance.brand.email = instance.email
        instance.brand.save()

class SubCategory(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
   

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    image = models.CharField(max_length=255, default='images/default.jpg')  # Set default image
    brand = models.CharField(max_length=255)  # Store brand name
    price = models.DecimalField(max_digits=10, decimal_places=2)
    offline_store = models.TextField(blank=True, null=True)
    online_store = models.URLField(max_length=500, blank=True, null=True)  # Store URL
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name="products")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="products")
    brand_id = models.ForeignKey(Brand, null=True, on_delete=models.CASCADE, related_name="products")

    def __str__(self):
        return self.name

class FavoriteProduct(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'product')

