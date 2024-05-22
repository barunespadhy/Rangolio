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


class MediaSerializer(serializers.Serializer):
    media = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False)
    )
    resource_type = serializers.CharField(allow_blank=False)
    resource_id		= serializers.CharField(allow_blank=False)