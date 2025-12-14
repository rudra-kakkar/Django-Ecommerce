from django.db import models
from django.conf import settings
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length = 100 , unique = True)

    slug = models.SlugField(max_length=120,unique=True, blank=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["name"]
    def __str__(self):
        return self.name

class Product(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits = 10, decimal_places = 2)
    category = models.ForeignKey(Category, on_delete = models.CASCADE, related_name = "products")
    image = models.ImageField(upload_to="products/", blank=True, null=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name = "products")
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)
    is_active = models.BooleanField(default = True)
    
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
    