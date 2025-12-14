from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source = 'category',
        queryset = Category.objects.all(),
        write_only=True
        )
    created_by = serializers.ReadOnlyField(source = "created_by.username")
    is_active = serializers.BooleanField(default=True)
       
    class Meta: 
        model = Product 
        fields = ['id','title','description','price','category','image','category_id','created_by','created_at','updated_at','is_active']
        read_only_fields = ['created_at','updated_at','created_by']