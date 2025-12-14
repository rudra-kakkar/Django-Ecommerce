from django.urls import path
from .views import CheckoutView, UserOrdersView, AdminOrdersView, UpdateOrderStatusView

urlpatterns = [
    path("checkout/", CheckoutView.as_view()),
    path("my/", UserOrdersView.as_view()),
    path("", AdminOrdersView.as_view()),  # Admin endpoint for all orders
    path("update/<int:order_id>/", UpdateOrderStatusView.as_view()),
]
