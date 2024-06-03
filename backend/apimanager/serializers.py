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
	blog_metadata = serializers.SerializerMethodField()

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
		blogs = obj.blogs.all()
		return [{
			'blog_id': blog.blog_id,
			'name': blog.name,
			'description': blog.description,
			'cover_image': blog.cover_image,
			'tagline': blog.tagline,
			'parent_category': blog.parent_category.category_id
		} for blog in blogs]

	def to_representation(self, instance):
		representation = super().to_representation(instance)
		return representation

class MediaSerializer(serializers.Serializer):
    media = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False)
    )
    resource_type = serializers.CharField(max_length=255, allow_blank=False)
    resource_id		= serializers.CharField(max_length=255, allow_blank=False)