#######################Django related imports####################
import os
import shutil
import random
import json
import ast
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
#################################################################
#API related imports
from .models import (
	UserData, 
	Category, 
	Blog
)
from .serializers import (
    UserDataSerializer,
    ThemeDataSerializer,
	CategorySerializer,
    BlogSerializer,
    UnifiedCategoryBlogSerializer,
    MediaSerializer
)
################################################################
#Custom Imports
from .custom_storage import CustomStorage

#UserData related views#############################################
class UserDataUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDataSerializer

    def get_object(self):
        obj, created = UserData.objects.get_or_create(pk=1)
        return obj

class UserDataListAPIView(generics.ListAPIView):
    queryset            = UserData.objects.all()
    serializer_class    = UserDataSerializer
#####################################################################

#ThemeData related views#############################################
class ThemeDataUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ThemeDataSerializer

    def get_object(self):
        obj, created = UserData.objects.get_or_create(pk=1)
        return obj

class ThemeDataListAPIView(generics.ListAPIView):
    queryset            = UserData.objects.all()
    serializer_class    = ThemeDataSerializer
#####################################################################

#Category related views#############################################
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
################################################################

#Blog related views##################################################
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

####################################################################


class MediaUpload(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_serializer = MediaSerializer(data=request.data)
        if file_serializer.is_valid():
            files = request.FILES.getlist('media')
            resource_type = file_serializer.validated_data['resource_type']
            resource_id = file_serializer.validated_data['resource_id']
            file_path_base = f'data'

            for f in files:
                file_unique_slug = ''.join(random.choices('ABCDEabcde12345', k=6))
                if resource_id != resource_type:
                    file_path = f"{file_path_base}/{resource_type}/{resource_id}/media/{file_unique_slug+resource_id+f.name}"
                else:
                    file_path = f"{file_path_base}/{resource_type}/media/{file_unique_slug+resource_id+f.name}"
                default_storage.save(file_path, f)

            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListMedia(APIView):
    def get(self, request, resource_type, resource_id, format=None):
        if resource_id != resource_type:
            media_folder = os.path.join(settings.MEDIA_ROOT, 'data', resource_type, resource_id, 'media')
        else:
            media_folder = os.path.join(settings.MEDIA_ROOT, 'data', resource_type, 'media')

        if not os.path.exists(media_folder):
            return Response({'error': 'Media directory not found'}, status=status.HTTP_404_NOT_FOUND)

        media_files = [f for f in os.listdir(media_folder) if f.endswith(('.png', '.jpg', '.jpeg'))]
        if resource_id != resource_type:
            media_urls = [request.build_absolute_uri(f'{settings.MEDIA_URL}data/{resource_type}/{resource_id}/media/' + f) for f in media_files]
        else:
            media_urls = [request.build_absolute_uri(f'{settings.MEDIA_URL}data/{resource_type}/media/' + f) for f in media_files]

        return Response({'media': media_urls}, status=status.HTTP_200_OK)

    def delete(self, request, resource_type, resource_id, format=None):
        if resource_id != resource_type:
            media_folder = os.path.join(settings.MEDIA_ROOT, 'data', resource_type, resource_id, 'media')
        else:
            media_folder = os.path.join(settings.MEDIA_ROOT, 'data', resource_type, 'media')
        file_name = request.query_params.get('file')
        if not file_name or not file_name.endswith(('.png', '.jpg', '.jpeg')):
            return Response({'error': 'Invalid or no file name provided'}, status=status.HTTP_400_BAD_REQUEST)

        file_path = os.path.join(media_folder, file_name)
        if os.path.exists(file_path):
            os.remove(file_path)
            return Response({'message': 'File deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

class Publish(APIView):
    def get(self, request, deploy_type, format=None):
        storage = CustomStorage()
        self.create_json(storage)
        return Response({"deploy_type": deploy_type}, status=status.HTTP_200_OK)

    def create_json(self, storage):
        self.create_user_data_json(UserData.objects.first(), storage)
        self.create_theme_data_json(UserData.objects.first(), storage)
        self.create_category_data_json(Category, storage)
        self.create_blog_data_json(Blog.objects.all(), storage)
        self.merge_media()

    def create_user_data_json(self, instance, storage):
        json_content = {
            "name": instance.name,
            "introContent": instance.intro_content,
            "profilePhoto": self.sanitize_media_link(instance.profile_photo),
            "builtWith": instance.built_with
        }
        self.save_json(json_content, 'shared/user-data.json', storage)

    def create_theme_data_json(self, instance, storage):
        json_content = {
            "defaultTheme": instance.default_theme,
            "darkTheme": ast.literal_eval(instance.dark_theme),
            "lightTheme": ast.literal_eval(instance.light_theme),
        }
        self.save_json(json_content, 'shared/theme-config.json', storage)

    def create_category_data_json(self, model_instance, storage):
        categories = []
        instance_objects = model_instance.objects.all()
        if not instance_objects.exists():
            self.save_json([], 'category/category-metadata.json', storage)
        else:
            for eachInstance in instance_objects:
                instance_data = {
                    "id": str(eachInstance.category_id),
                    "name": eachInstance.name,
                    "coverImage": self.sanitize_media_link(eachInstance.cover_image),
                    "tagLine": eachInstance.tagline,
                    "description": eachInstance.description,
                    "featuredBlog": eachInstance.featured_id
                }
                categories.append(instance_data)
                self.create_instance_data(instance_data, model_instance.objects.get(category_id=eachInstance.category_id), storage)
            self.save_json(categories, 'category/category-metadata.json', storage)


    def create_blog_data_json(self, instance, storage):
        print(instance)
        if not instance.exists():
            pass
        else:
            for eachBlog in instance:
                instance_data = {
                    "id": str(eachBlog.blog_id),
                    "name": eachBlog.name,
                    "description": eachBlog.description,
                    "coverimage": self.sanitize_media_link(eachBlog.cover_image),
                    "tagLine": eachBlog.tagline,
                    "parentCategory": str(eachBlog.parent_category.category_id),
                    "contentBody": eachBlog.content_body
                }
                self.save_json(instance_data, f'blog/{instance_data["id"]}/blog-data.json', storage)

    def merge_media(self):
        source_dir = 'media/data'
        destination_dir = 'deploy/data'
        if not os.path.exists(source_dir):
            print("The source directory does not exist.")
        else:
            try:
                shutil.copytree(source_dir, destination_dir, dirs_exist_ok=True)
                print(f"Directory copied successfully from {source_dir} to {destination_dir}")
            except Exception as e:
                print(f"Error occurred: {e}")

    def create_instance_data(self, instance_data, blogs_by_category_instance, storage):
        instance_data["blogMetadata"]=[]
        blogs = blogs_by_category_instance.blogs.all()
        if not blogs.exists():
            self.save_json(instance_data, f'category/{instance_data["id"]}/category-data.json', storage)
        else:
            for eachBlog in blogs:
                instance_data["blogMetadata"].append({
                    "id": str(eachBlog.blog_id),
                    "name": eachBlog.name,
                    "description": eachBlog.description,
                    "coverimage": self.sanitize_media_link(eachBlog.cover_image),
                    "tagLine": eachBlog.tagline,
                    "parentCategory": instance_data["id"]
                })
            self.save_json(instance_data, f'category/{instance_data["id"]}/category-data.json', storage)

    def save_json(self, json_content, file_name, storage):
        data_json = json.dumps(json_content, indent=2)
        if storage.exists(file_name):
            storage.delete(file_name)
        storage.save(file_name, ContentFile(data_json.encode('utf-8')))
    def sanitize_media_link(self, string):
        if not string:
            return ''
        return string.replace('http://127.0.0.1:8000/media/data/', '')

