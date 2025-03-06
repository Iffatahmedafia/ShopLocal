# backend/urls.py

from django.urls import path
from .views import RegisterView, LoginView, CategoryListView, SubCategoryListView, ProductListView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('subcategories/', SubCategoryListView.as_view(), name='subcategories'),
    path('products/', ProductListView.as_view(), name='products'),
]
