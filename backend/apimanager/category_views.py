import os
import shutil
#######################Django related imports####################
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
#################################################################
#API related imports
from .models import (
    Category,
    Blog
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
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'category_id'

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        media_folder = os.path.join(settings.MEDIA_ROOT, 'data', 'category', str(instance.category_id))

        if os.path.exists(media_folder):
            shutil.rmtree(media_folder)
        if hasattr(instance, 'blogs'):  # Ensuring the related_name is 'blogs'
            for blog in instance.blogs.all():
                blog_media_folder = os.path.join(settings.MEDIA_ROOT, 'data', 'blog', str(blog.blog_id))
                if os.path.exists(blog_media_folder):
                    shutil.rmtree(blog_media_folder)

        return super().delete(request, *args, **kwargs)

class BlogsByCategoryAPIView(APIView):
    def get(self, request, category_id):
        try:
            category = Category.objects.get(category_id=category_id)
        except Category.DoesNotExist:
            return Response({'message': 'Category not found'}, status=404)

        serializer = UnifiedCategoryBlogSerializer(category)
        return Response(serializer.data)