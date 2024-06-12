from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from . import views

from apimanager.user_data_views import (
    UserDataUpdateAPIView,
    UserDataListAPIView,
    ThemeDataUpdateAPIView,
    ThemeDataListAPIView
)

from apimanager.category_views import (
    CategoryCreateAPIView,
    CategoryUpdateAPIView,
    CategoryDeleteAPIView,
    CategoryListAPIView,
    BlogsByCategoryAPIView
)

from apimanager.blog_views import (
    BlogCreateAPIView,
    BlogUpdateAPIView,
    BlogRetrieveAPIView,
    BlogDeleteAPIView
)

from apimanager.media_views import (
    MediaUpload,
    ListMedia
)

from apimanager.publish_views import (
    PublishMethods,
    Publish
)

urlpatterns = [
    
    # API Views
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
    path('data/blog/create/', BlogCreateAPIView.as_view(), name='blog-create-view'),
    path('data/blog/<slug:blog_id>/', BlogRetrieveAPIView.as_view(), name='blog-retrieve-view'),
    path('data/blog/update/<slug:blog_id>/', BlogUpdateAPIView.as_view(), name='blog-update-view'),
    path('data/blog/delete/<slug:blog_id>/', BlogDeleteAPIView.as_view(), name='blog-delete-view'),
    path('data/upload/', MediaUpload.as_view(), name='media-upload'),
    path('data/media/<str:resource_type>/<str:resource_id>/', ListMedia.as_view(), name='list-media'),
    path('data/publish/methods/', PublishMethods.as_view(), name='publish-methods'),
    path('data/publish/<str:deploy_type>/', Publish.as_view(), name='publish'),

    # Frontend Views
    path('', views.index, name='index'),
    path('categories', views.index, name='index'),
    path('categories/<str:website_slug>', views.index, name='index'),
    path('blog/<str:website_slug>', views.index, name='index'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)