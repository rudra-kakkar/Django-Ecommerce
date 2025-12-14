from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Cart,CartItem
from products.models import Product
from .serializers import CartSerializer,CartItemSerializer


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        cart,created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        if not product_id:
            return Response({"error": "product_id is required"}, status=400)

        try:
            product = Product.objects.get(id=product_id)
        except:
            return Response({"error": "Product not found"}, status=404)

        cart, created = Cart.objects.get_or_create(user=request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart, 
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartSerializer(cart).data, status=201)


# Update quantity
class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except:
            return Response({"error": "Item not found"}, status=404)

        quantity = request.data.get("quantity")

        if quantity is None or int(quantity) < 1:
            return Response({"error": "Invalid quantity"}, status=400)

        item.quantity = int(quantity)
        item.save()

        return Response(CartSerializer(item.cart).data)


# Remove item
class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except:
            return Response({"error": "Item not found"}, status=404)

        cart = item.cart
        item.delete()

        return Response(CartSerializer(cart).data)