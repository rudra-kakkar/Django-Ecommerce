from rest_framework import viewsets,filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product, Category
from .serializers import ProductSerializer,CategorySerializer
from .permissions import IsAdminOrReadOnly,IsAdminOrCreator

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class  = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title","discription"]
    ordering_fields = ["price","created_at"]

    def get_queryset(self):
        # Check if filtering by created_by (user's own products)
        created_by = self.request.query_params.get("created_by")
        
        if created_by:
            # Filter products by the specified user ID
            queryset = Product.objects.filter(created_by_id=created_by)
        elif self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            # Admin users can see all products (including inactive)
            queryset = Product.objects.all()
        else:
            # Regular users only see active products
            queryset = Product.objects.filter(is_active=True)
        
        category_id = self.request.query_params.get("category_id")
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset
    
    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminOrCreator()]   # only admin or creator can update/delete
        return [IsAuthenticatedOrReadOnly()]       # safe methods allowed for all

    def perform_create(self,serializer):
        serializer.save(created_by = self.request.user)