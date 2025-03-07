from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views




urlpatterns = [
    path('mango/', views.MangoAPIView.as_view(), name='mango'),
    path('mango/<int:id>/', views.MangoDetailAPIView.as_view(), name='mango-detail'),
    path('comment/comments_by_mango/', views.CommentAPIView.as_view(), name='comments-by-mango'),
    path('all_comment/', views.AllCommentsAPIView.as_view(), name='all-comments'),
]