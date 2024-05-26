"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls import include
from .views import my_form
from apimanager.views import (
    UserDataUpdateAPIView,
    UserDataListAPIView,
    ThemeDataUpdateAPIView,
    ThemeDataListAPIView,
    CategoryCreateAPIView,
    CategoryUpdateAPIView,
    CategoryDeleteAPIView,
    CategoryListAPIView,
    BlogCreateAPIView,
    BlogUpdateAPIView,
    BlogRetrieveAPIView,
    BlogDeleteAPIView,
    BlogsByCategoryAPIView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('data/shared/user-data/', UserDataListAPIView.as_view(), name='user-data-list-view'),
    path('data/shared/update/user-data/', UserDataUpdateAPIView.as_view(), name='user-data-update-view'),
    path('data/shared/theme-config/', ThemeDataListAPIView.as_view(), name='theme-data-list-view'),
    path('data/shared/update/theme-config/', ThemeDataUpdateAPIView.as_view(), name='theme-data-update-view'),
    path('data/category/', CategoryListAPIView.as_view(), name='category-list-view'),
    path('data/category/create/', CategoryCreateAPIView.as_view(), name='category-create-view'),
    path('data/category/<slug:category_id>/', BlogsByCategoryAPIView.as_view(), name='blogs-by-category-view'),
    path('data/category/update/<slug:category_id>/', CategoryUpdateAPIView.as_view(), name='category-update-view'),
    path('data/category/delete/<slug:category_id>/', CategoryDeleteAPIView.as_view(), name='category-delete-view'),
    path('data/blog/<slug:blog_id>/', BlogRetrieveAPIView.as_view(), name='blog-retrieve-view'),
    path('data/blog/create/<slug:blog_id>/', BlogCreateAPIView.as_view(), name='blog-create-view'),
    path('data/blog/update/<slug:blog_id>/', BlogUpdateAPIView.as_view(), name='blog-update-view'),
    path('data/blog/delete/<slug:blog_id>/', BlogDeleteAPIView.as_view(), name='blog-delete-view'),
]