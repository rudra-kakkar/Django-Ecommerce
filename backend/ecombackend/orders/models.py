from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ("PENDING","Pending"),
        ("APPROVED","Approved"),
        ("PAID","Paid"),
        ("SHIPPED","Shipped"),
        ("DELIVERED","Delivered"),
        ("CANCELLED","Cancelled")
    )

        
    PAYMENT_METHOD_CHOICES = (
        ("COD", "Cash on Delivery"),
        ("MOCK", "Mock Online Payment"),
    )

    PAYMENT_STATUS_CHOICES = (
        ("UNPAID", "Unpaid"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_price  = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=30, choices=PAYMENT_METHOD_CHOICES
    )
    payment_status = models.CharField(
        max_length=30, choices=PAYMENT_STATUS_CHOICES, default="UNPAID"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    shipping_address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order {self.id} by {self.user.username}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    @property
    def subtotal(self): 
        return self.price * self.quantity

    def __str__(self):
        return f"{self.product.title} x {self.quantity}"