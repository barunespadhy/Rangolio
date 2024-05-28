from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from django.urls import reverse
from django.utils import timezone
from rest_framework import serializers
from .models import (
	UserData, 
	Category, 
	Blog
)

class UserDataSerializer(serializers.ModelSerializer):
	
	class Meta:
		model  = UserData
		fields = [
			'name',
			'intro_content',
			'profile_photo',
		]

class ThemeDataSerializer(serializers.ModelSerializer):
	
	class Meta:
		model  = UserData
		fields = [
			'default_theme',
			'dark_theme',
			'light_theme'
		]

class CategorySerializer(serializers.ModelSerializer):
	
	class Meta:
		model  = Category
		fields = [
			'category_id',
			'featured_id',
			'name',
			'description',
			'tagline',
			'cover_image'
		]

class BlogSerializer(serializers.ModelSerializer):
	
	class Meta:
		model  = Blog
		fields = [
			'blog_id',
			'name',
			'description',
			'tagline',
			'cover_image',
			'content_body',
			'parent_category'
		]


class UnifiedCategoryBlogSerializer(serializers.ModelSerializer):
	blog_metadata = serializers.SerializerMethodField()  # Custom field for related blogs

	class Meta:
		model = Category
		fields = [
			'category_id',
			'name',
			'cover_image',
			'tagline',
			'description',
			'featured_id',
			'blog_metadata'
		]

	def get_blog_metadata(self, obj):
		# Serializes all blogs related to the category, assuming `blogs` as the related_name
		blogs = obj.blogs.all()
		return [{
			'blog_id': blog.blog_id,  # Using UUID
			'name': blog.name,
			'description': blog.description,
			'cover_image': blog.cover_image,
			'tagline': blog.tagline,
			'parent_category': blog.parent_category.category_id
			# Assuming parent_category is a reference to a Category object
		} for blog in blogs]

	def to_representation(self, instance):
		representation = super().to_representation(instance)
		# Set a featured blog based on some logic, e.g., the first blog
		representation['featured_id'] = instance.blogs.first().blog_id if instance.blogs.exists() else None
		return representation

class MediaSerializer(serializers.Serializer):
    media = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False)
    )
    resource_type = serializers.CharField(allow_blank=False)
    resource_id		= serializers.CharField(allow_blank=False)