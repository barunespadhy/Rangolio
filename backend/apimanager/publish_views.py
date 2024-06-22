import os
import shutil
import json
import ast
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from django.core.files.base import ContentFile
from bs4 import BeautifulSoup

from .custom_storage import (
    CustomStorage
)

from .utilities import (
    copy_content
)

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
        json_storage_location = settings.DEPLOY_CONFIG["EDITOR_DATA_LOCATION"]
        html_storage_location = settings.DEPLOY_CONFIG["EDITOR_HTML_LOCATION"]
        
        json_storage = CustomStorage(json_storage_location)
        html_storage = CustomStorage(html_storage_location)

        self.delete_old_data(json_storage_location)
        self.delete_old_data(html_storage_location)

        self.create_json_and_html(json_storage, html_storage, deploy_type)
        response = self.execute_deploy(deploy_type)
        return Response(response['message'], response['status'])
    
    def delete_old_data(self, data_directory):
        if os.path.exists(data_directory):
            shutil.rmtree(data_directory)
            print(f"The directory {data_directory} has been deleted.")
        else:
            print(f"The directory {data_directory} does not exist.")

    def create_json_and_html(self, json_storage, html_storage, deploy_type):
        self.create_user_data_json_and_html(UserData.objects.first(), json_storage, html_storage, deploy_type)
        self.create_theme_data_json(UserData.objects.first(), json_storage)
        self.create_category_data_json_and_html(Category, json_storage, html_storage, deploy_type)
        self.create_blog_data_json_and_html(Blog.objects.all(), json_storage, html_storage, deploy_type, UserData.objects.first())
        copy_content(
            settings.DEPLOY_CONFIG["EDITOR_MEDIA_LOCATION"],
            settings.DEPLOY_CONFIG["EDITOR_DATA_LOCATION"],
            'folder',
        )

    def create_user_data_json_and_html(self, instance, json_storage, html_storage, deploy_type):
        json_content = {
            "name": instance.name,
            "introContent": self.sanitize_media_link(instance.intro_content, 'content_media'),
            "profilePhoto": self.sanitize_media_link(instance.profile_photo),
            "builtWith": instance.built_with
        }
        self.save_json(json_content, 'shared/user-data.json', json_storage)

        html_file = open(f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/{deploy_type}/index.html', "r")
        html_file_content = html_file.read()
        html_soup = BeautifulSoup(html_file_content, 'lxml')

        html_soup.title.string = json_content['name']
        meta_description = html_soup.new_tag('meta', attrs={'name': 'description', 'content': f'This is the portfolio and blog of {json_content["name"]}'})
        meta_robots = html_soup.new_tag('meta', attrs={'name': 'robots', 'content': 'index, follow'})
        html_soup.head.append(meta_description)
        html_soup.head.append(meta_robots)
        html_storage.save(f'index.html', ContentFile(str(html_soup).encode('utf-8')))
        copy_content(f'{settings.DEPLOY_CONFIG["EDITOR_HTML_LOCATION"]}/index.html',
            f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/{deploy_type}/index.html',
            'file',
            'remove_and_copy'
        )

    def create_theme_data_json(self, instance, json_storage):
        json_content = {
            "defaultTheme": instance.default_theme,
            "darkTheme": ast.literal_eval(instance.dark_theme),
            "lightTheme": ast.literal_eval(instance.light_theme),
        }
        self.save_json(json_content, 'shared/theme-config.json', json_storage)

    def create_category_data_json_and_html(self, model_instance, json_storage, html_storage, deploy_type):
        categories = []
        instance_objects = model_instance.objects.all()
        if not instance_objects.exists():
            self.save_json([], 'category/category-metadata.json', json_storage)
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
                self.create_instance_data(instance_data, model_instance.objects.get(category_id=eachInstance.category_id), json_storage)
            self.save_json(categories, 'category/category-metadata.json', json_storage)
        self.save_html(categories, 'categories', html_storage, deploy_type)

    def create_blog_data_json_and_html(self, instance, json_storage, html_storage, deploy_type, UserDataInstance):
        blogs = []
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
                blogs.append(instance_data)
                self.save_json(instance_data, f'blog/{instance_data["id"]}/blog-data.json', json_storage)
            self.save_html(blogs, 'blog', html_storage, deploy_type, UserDataInstance)

    def create_instance_data(self, instance_data, blogs_by_category_instance, json_storage):
        instance_data["blogMetadata"]=[]
        blogs = blogs_by_category_instance.blogs.all()
        if not blogs.exists():
            self.save_json(instance_data, f'category/{instance_data["id"]}/category-data.json', json_storage)
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
            self.save_json(instance_data, f'category/{instance_data["id"]}/category-data.json', json_storage)

    def save_json(self, json_content, file_name, storage):
        data_json = json.dumps(json_content, indent=2)
        if storage.exists(file_name):
            storage.delete(file_name)
        storage.save(file_name, ContentFile(data_json.encode('utf-8')))

    def save_html(self, json_content, resource_type, storage, deploy_type, UserDataInstance=None):
        html_file = open(f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/{deploy_type}/index.html', "r")
        html_file_content = html_file.read()
        html_soup = BeautifulSoup(html_file_content, 'lxml')

        html_soup.title.string = resource_type
        meta_robots = html_soup.new_tag('meta', attrs={'name': 'robots', 'content': 'index, follow'})
        html_soup.head.append(meta_robots)

        storage.save(f'{resource_type}/index.html', ContentFile(str(html_soup).encode('utf-8')))

        for eachEntry in json_content:
            html_soup = BeautifulSoup(html_file_content, 'lxml')
            html_soup.title.string = eachEntry['name']
            meta_description = html_soup.new_tag('meta', attrs={'name': 'description', 'content': f'{eachEntry["name"]} {eachEntry["description"]} {eachEntry["tagLine"]}'})
            meta_robots = html_soup.new_tag('meta', attrs={'name': 'robots', 'content': 'index, follow'})
            meta_language = html_soup.new_tag('meta', attrs={'name': 'language', 'content': 'english'})

            meta_og_description = html_soup.new_tag('meta', attrs={'name': 'og:description', 'content': f'{eachEntry["name"]} {eachEntry["description"]} {eachEntry["tagLine"]}'})
            meta_og_title = html_soup.new_tag('meta', attrs={'name': 'og:title', 'content': eachEntry['name']})
            meta_og_type = html_soup.new_tag('meta', attrs={'name': 'og:type', 'content': 'website'})

            html_soup.head.append(meta_description)
            html_soup.head.append(meta_robots)
            html_soup.head.append(meta_language)
            html_soup.head.append(meta_og_description)
            html_soup.head.append(meta_og_title)
            html_soup.head.append(meta_og_type)

            if UserDataInstance:
                meta_author = html_soup.new_tag('meta', attrs={'name': 'author', 'content': UserDataInstance.name})
                html_soup.head.append(meta_author)

            storage.save(f'{resource_type}/{eachEntry["id"]}/index.html', ContentFile(str(html_soup).encode('utf-8')))

    def sanitize_media_link(self, string, content_type='element'):
        if not string:
            return ''
        if content_type == 'content_media':
            return string.replace('<img src="http://127.0.0.1:8000/media', '<img src="')
        else:
            return string.replace('http://127.0.0.1:8000/media/data/', '')
    
    def execute_deploy(self, deploy_type):
        response = {
            'message': 'Something failed',
            'status': status.HTTP_500_INTERNAL_SERVER_ERROR
        }

        if deploy_type == "server":
            response = server_deploy()
        if deploy_type == "ghpages":
            response = github_deploy()

        return response
