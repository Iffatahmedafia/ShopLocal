# backend/urls.py

from django.urls import path
from .views import RegisterView, BrandView, LoginView, LogoutView, ForgotPasswordView, ResetPasswordView, CategoryListView, SubCategoryListView, SubSubCategoryListView, ProductListView, ProductView, FavoriteProductView, SavedBrandView, CheckAuthView, UserProfileView, UserListView, PasswordUpdateView, LogInteractionView, LLMRecommendationView, GenerateTagsFromDescriptionView, ChatbotAPIView, BrandAnalyticsView,AdminAnalyticsView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check_auth/', CheckAuthView.as_view()),
    path('forgot-password/', ForgotPasswordView.as_view()),
    path('reset-password/', ResetPasswordView.as_view()),
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
    path('brands/update/<int:brand_id>/', BrandView.as_view(), name='brand_update'),
    path('brands/<int:brand_id>/status/', BrandView.as_view(), name='brand-status-update'),
    path('product/create/', ProductView.as_view(), name='add_product'),
    path('product/update/<int:product_id>', ProductView.as_view(), name='update_product'),
    path('product/trash/<int:product_id>/', ProductView.as_view(), name='trash_product'),
    path('products/<int:product_id>/status/', ProductView.as_view(), name='product-status-update'),
    path('saved_brands/add/', SavedBrandView.as_view(), name='save_brand'),
    path('saved_brands/', SavedBrandView.as_view(), name='get_saved_brand'),
    path('saved_brands/remove/<int:brand_id>/', SavedBrandView.as_view(), name='delete_saved_brand'),
    path("generate-tags/", GenerateTagsFromDescriptionView.as_view(), name="generate-tags"),
    path('interactions/', LogInteractionView.as_view(), name='log_interaction'),
    path('recommendations/', LLMRecommendationView.as_view(), name='get_recommendations'),
    path('chatbot/', ChatbotAPIView.as_view(), name='chat-bot'),
    path('brand/analytics/', BrandAnalyticsView.as_view()),
    path('admin/analytics/', AdminAnalyticsView.as_view()),
    
 
    # URL for adding to favorites (POST)
    path('favorites/add/', FavoriteProductView.as_view(), name='add_favourite'),
    
    # URL for getting all favorites (GET)
    path('favorites/', FavoriteProductView.as_view(), name='get_favourites'),
    
    # URL for deleting a product from favorites (DELETE)
    path('favorites/remove/<int:product_id>/', FavoriteProductView.as_view(), name='delete_favourite'),

]
