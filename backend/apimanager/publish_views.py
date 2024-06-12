import os
import shutil
import json
import ast
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.files.base import ContentFile

#Custom Imports
from .custom_storage import CustomStorage

from .models import (
    UserData, 
    Category,
    Blog
)

from .publish_methods import (
    deployment_methods,
    server_deploy,
    github_deploy
)

class PublishMethods(APIView):
    def get(self, request, format=None):
        return Response(deployment_methods, status=status.HTTP_200_OK)

class Publish(APIView):
    def get(self, request, deploy_type, format=None):
        if deploy_type not in deployment_methods:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        storage = CustomStorage()
        self.delete_old_data()
        self.create_json(storage)
        self.execute_deploy(deploy_type)
        return Response({"deploy_type": deploy_type}, status=status.HTTP_200_OK)
    
    
    def delete_old_data(self):
        data_directory = 'deploy/data'

        if os.path.exists(data_directory):
            shutil.rmtree(data_directory)
            print(f"The directory {data_directory} has been deleted.")
        else:
            print(f"The directory {data_directory} does not exist.")

    def create_json(self, storage):
        self.create_user_data_json(UserData.objects.first(), storage)
        self.create_theme_data_json(UserData.objects.first(), storage)
        self.create_category_data_json(Category, storage)
        self.create_blog_data_json(Blog.objects.all(), storage)
        self.merge_media()

    def create_user_data_json(self, instance, storage):
        json_content = {
            "name": instance.name,
            "introContent": self.sanitize_media_link(instance.intro_content, 'content_media'),
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
        if not instance.exists():
            pass
        else:
            for eachBlog in instance:
                instance_data = {
                    "id": str(eachBlog.blog_id),
                    "name": eachBlog.name,
                    "description": eachBlog.description,
                    "coverImage": self.sanitize_media_link(eachBlog.cover_image),
                    "tagLine": eachBlog.tagline,
                    "parentCategory": str(eachBlog.parent_category.category_id),
                    "contentBody": self.sanitize_media_link(eachBlog.content_body, 'content_media')
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
                    "coverImage": self.sanitize_media_link(eachBlog.cover_image),
                    "tagLine": eachBlog.tagline,
                    "parentCategory": instance_data["id"]
                })
            self.save_json(instance_data, f'category/{instance_data["id"]}/category-data.json', storage)

    def save_json(self, json_content, file_name, storage):
        data_json = json.dumps(json_content, indent=2)
        if storage.exists(file_name):
            storage.delete(file_name)
        storage.save(file_name, ContentFile(data_json.encode('utf-8')))
    def sanitize_media_link(self, string, content_type='element'):
        if not string:
            return ''
        if content_type == 'content_media':
            return string.replace('<img src="http://127.0.0.1:8000/media', '<img src="')
        else:
            return string.replace('http://127.0.0.1:8000/media/data/', '')
    
    
    
    def execute_deploy(self, deploy_type):
        if deploy_type == "server_deploy":
            server_deploy()
        if deploy_type == "github_deploy":
            github_deploy()