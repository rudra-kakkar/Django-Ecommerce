from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from cart.models import Cart, CartItem
from .models import Order, OrderItem
from .serializers import OrderSerializer
from .tasks import send_order_confirmation_email


# Checkout: Convert cart → order
class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        payment_method = request.data.get("payment_method")
        print(payment_method)
        if payment_method not in ["COD", "MOCK"]:
            return Response(
                {"error": "Invalid payment method"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart is empty"}, status=400)

        if cart.items.count() == 0:
            return Response({"error": "Cart has no items"}, status=400)
        
        # Payment logic
        if payment_method == "COD":
            payment_status = "UNPAID"
            order_status = "PENDING"
        else:  # MOCK
            payment_status = "SUCCESS"
            order_status = "PAID"

        # Get shipping address and payment method from request
        shipping_address = request.data.get("shipping_address", "")

        # Calculate total first
        total = 0
        cart_items = list(cart.items.all())  # Convert to list to avoid query issues
        
        if not cart_items:
            return Response({"error": "Cart has no items"}, status=400)

        # Validate all products exist and are active
        for item in cart_items:
            if not item.product:
                return Response({"error": f"Product not found for cart item {item.id}"}, status=400)
            if not item.product.is_active:
                return Response({"error": f"Product '{item.product.title}' is not available"}, status=400)
            try:
                price = float(item.product.price)
                total += price * item.quantity
            except (ValueError, TypeError) as e:
                return Response({"error": f"Invalid price for product '{item.product.title}'"}, status=400)

        if total <= 0:
            return Response({"error": "Order total must be greater than zero"}, status=400)

        # Create order with initial total_price
        try:
            order = Order.objects.create(
                user=user,
                total_price=total,
                shipping_address=shipping_address,
                payment_method=payment_method,
                payment_status=payment_status,
                status=order_status
            )
        except Exception as e:
            error_detail = str(e)
            # Check if it's a migration issue (field doesn't exist in database)
            if "shipping_address" in error_detail or "payment_method" in error_detail or "no such column" in error_detail.lower():
                return Response({
                    "error": "Database migration required. Please run: python manage.py migrate orders"
                }, status=500)
            return Response({"error": f"Failed to create order: {error_detail}"}, status=500)

        # Create order items
        try:
            for item in cart_items:
                price = float(item.product.price)
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=price,
                )
               
        except Exception as e:
            # If order items fail, delete the order
            order.delete()
            return Response({"error": f"Failed to create order items: {str(e)}"}, status=500)

        # Clear cart after successful order creation
        try:
            cart.items.all().delete()
        except Exception as e:
            # Log error but don't fail the order
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Failed to clear cart: {str(e)}")
        
        send_order_confirmation_email.delay(
            user.email,
            order.id,
            order.total_price
        )

        return Response({
            "message": "Order created successfully",
            "order":OrderSerializer(order).data,
            }, status=201)


# User sees only their orders
class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


# Admin can see all orders
class AdminOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({"error": "Admin only"}, status=403)
        
        orders = Order.objects.all().order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


# Admin can update order status
class UpdateOrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, order_id):
        if not request.user.is_admin:
            return Response({"error": "Admin only"}, status=403)

        try:
            order = Order.objects.get(id=order_id)
        except:
            return Response({"error": "Order not found"}, status=404)

        status_val = request.data.get("status")
        if not status_val:
            return Response({"error": "Status is required"}, status=400)
        
        # Check if status is valid (STATUS_CHOICES is a list of tuples)
        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if status_val not in valid_statuses:
            return Response({
                "error": f"Invalid status. Valid statuses are: {', '.join(valid_statuses)}"
            }, status=400)

        order.status = status_val
        order.save()

        return Response(OrderSerializer(order).data)
