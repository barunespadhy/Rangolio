from django.contrib import admin
from .models import (
	UserData, 
	Category, 
	Blog
)

admin.site.register(UserData)
admin.site.register(Category)
admin.site.register(Blog)