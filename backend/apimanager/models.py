from django.db import models
from .initialize_data import userdata

class UserData(models.Model):
	name			= models.CharField(default=userdata["name"], null=False, blank=False, max_length=200)
	intro_content	= models.CharField(default=userdata["intro_content"], null=False, blank=False, max_length=100000)
	profile_photo 	= models.CharField(null=True, blank=True, max_length=500)
	default_theme	= models.CharField(default=userdata["default_theme"], null=False, blank=False, max_length=200)
	dark_theme		= models.CharField(default=userdata["dark_theme"], null=False, blank=False, max_length=1500)
	light_theme		= models.CharField(default=userdata["light_theme"], null=False, blank=False, max_length=1500)

class Category(models.Model):
	category_id		= models.SlugField()
	featured_id		= models.CharField(null=True, blank=True, max_length=500)
	name			= models.CharField(null=False, blank=False, max_length=200)
	description 	= models.CharField(null=False, blank=False, max_length=200)
	tagline			= models.CharField(null=False, blank=False, max_length=200)
	cover_image 	= models.CharField(null=True, blank=True, max_length=500)


class Blog(models.Model):
	blog_id			= models.SlugField()
	name			= models.CharField(null=False, blank=False, max_length=200)
	description 	= models.CharField(null=False, blank=False, max_length=200)
	tagline			= models.CharField(null=False, blank=False, max_length=200)
	cover_image 	= models.CharField(null=True, blank=True, max_length=500)
	content_body	= models.CharField(default='<p></p>', null=False, blank=False, max_length=100000)
	parent_category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="blogs")