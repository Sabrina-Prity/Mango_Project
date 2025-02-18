from django.urls import path
from . import views




urlpatterns = [

    path('cart_create/', views.CartApiView.as_view()),
    path('cart_details/<int:pk>/', views.CartDetails.as_view()),
    path('product_get/', views.ProductGetCartID.as_view()),
    path('cart_products/<int:cart_id>/', views.CartProductsAPIView.as_view(), name='cart-products'),
    path('update-cart-item/<int:pk>/', views.CartItemsUpdate.as_view(), name='cart-item-update'),
    path('orders/', views.OrderListCreateView.as_view(), name='order_list_create'),
    path('orders-view/', views.UserOrdersView.as_view(), name='user-orders'),
    path('order_history/', views.OrderHistoryView.as_view(), name='order_history'),
    path('specific-order/<int:pk>/', views.UserSpecificOrderView.as_view(), name='specific-order'),
    path('admin-order/', views.AdminOrderAPIView.as_view(), name='admin-order'),
    path('admin-order-updated/<int:pk>/', views.AdminOrderUpdateAPIView.as_view(), name='admin-order-updated'),
    ]