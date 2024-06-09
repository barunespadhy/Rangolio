#######################Django related imports####################
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
#################################################################
#API related imports
from .models import (
Category,
)
from .serializers import (
    CategorySerializer,
    UnifiedCategoryBlogSerializer,
)
################################################################

class CategoryCreateAPIView(generics.CreateAPIView):
    queryset            = Category.objects.all()
    serializer_class    = CategorySerializer

class CategoryUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset            = Category.objects.all()
    serializer_class    = CategorySerializer
    lookup_field        = 'category_id'

class CategoryListAPIView(generics.ListAPIView):
    queryset            = Category.objects.all()
    serializer_class    = CategorySerializer

class CategoryDeleteAPIView(generics.DestroyAPIView):
    queryset            = Category.objects.all()
    serializer_class    = CategorySerializer
    lookup_field        = 'category_id'

class BlogsByCategoryAPIView(APIView):
    def get(self, request, category_id):
        try:
            category = Category.objects.get(category_id=category_id)
        except Category.DoesNotExist:
            return Response({'message': 'Category not found'}, status=404)

        serializer = UnifiedCategoryBlogSerializer(category)
        return Response(serializer.data)