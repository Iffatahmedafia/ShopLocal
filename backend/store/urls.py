# backend/urls.py

from django.urls import path
from .views import RegisterView, LoginView, CategoryListView, SubCategoryListView, ProductListView, FavoriteProductView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('subcategories/', SubCategoryListView.as_view(), name='subcategories'),
    path('products/', ProductListView.as_view(), name='products'),
 
    # URL for adding to favorites (POST)
    path('favorites/add/', FavoriteProductView.as_view(), name='add_favourite'),
    
    # URL for getting all favorites (GET)
    path('favorites/', FavoriteProductView.as_view(), name='get_favourites'),
    
    # URL for deleting a product from favorites (DELETE)
    path('favorites/remove/<int:product_id>/', FavoriteProductView.as_view(), name='delete_favourite'),

]
