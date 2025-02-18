
from django.urls import path, include
from . import views



urlpatterns = [
    
    path('list/', views.CategoryAPIView.as_view()),
    path('list/<int:pk>/', views.CategoryAPIView.as_view(), name='category-detail'),
    
]