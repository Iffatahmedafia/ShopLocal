# backend/urls.py

from django.urls import path
from .views import RegisterView, BrandView, LoginView, CategoryListView, SubCategoryListView, SubSubCategoryListView, ProductListView, ProductView, FavoriteProductView, CheckAuthView, UserProfileView, UserListView, PasswordUpdateView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('check_auth/', CheckAuthView.as_view()),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('subcategories/', SubCategoryListView.as_view(), name='subcategories'),
    path('sub_subsubcategories/', SubSubCategoryListView.as_view(), name='sub_subcategories'),
    path('products/', ProductListView.as_view(), name='products'),
    path('users/', UserListView.as_view(), name='get_brands'),
    path('profile/', UserProfileView.as_view(), name='get_users'),
    path('profile/update/', UserProfileView.as_view(), name='update_users'),
    path('password/update/', PasswordUpdateView.as_view(), name='update_password'),
    path('brands/', BrandView.as_view(), name='get_brands'),
    path('brand/create/', BrandView.as_view(), name='brand_register'),
    path('product/create/', ProductView.as_view(), name='add_product'),
 
    # URL for adding to favorites (POST)
    path('favorites/add/', FavoriteProductView.as_view(), name='add_favourite'),
    
    # URL for getting all favorites (GET)
    path('favorites/', FavoriteProductView.as_view(), name='get_favourites'),
    
    # URL for deleting a product from favorites (DELETE)
    path('favorites/remove/<int:product_id>/', FavoriteProductView.as_view(), name='delete_favourite'),

]
