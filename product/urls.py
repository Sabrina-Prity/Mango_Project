from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views




urlpatterns = [
    path('mango/', views.MangoAPIView.as_view(), name='mango'),
    path('mango/<int:id>/', views.MangoDetailAPIView.as_view(), name='mango-detail'),
    path('comment/<int:mango_id>/', views.CommentAPIView.as_view(), name='comments-by-mango'),
    path('comment/', views.CommentAPIView.as_view(), name='comments'),
]