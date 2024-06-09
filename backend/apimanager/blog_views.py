#######################Django related imports####################
import os
import shutil
from rest_framework import generics, status
from rest_framework.response import Response
from django.conf import settings
#################################################################
#API related imports
from .models import (
    Blog
)
from .serializers import (
    BlogSerializer,
)
################################################################

class BlogCreateAPIView(generics.CreateAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer

class BlogUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer
    lookup_field        = 'blog_id'

class BlogRetrieveAPIView(generics.RetrieveAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer
    lookup_field        = 'blog_id'

class BlogDeleteAPIView(generics.DestroyAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer
    lookup_field        = 'blog_id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.remove_directory(instance)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def remove_directory(self, instance):
        print(f"Deleting media files for {instance}")
        media_folder = os.path.join(settings.MEDIA_ROOT, 'data', 'blog', str(instance.blog_id))
        try:
            shutil.rmtree(media_folder)
            print(f"Directory '{media_folder}' and all its contents have been removed")
        except Exception as e:
            print(f"Failed to remove {media_folder}. Reason: {e}")