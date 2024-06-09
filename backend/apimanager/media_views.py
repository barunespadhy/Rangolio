import os
import random
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.conf import settings

from .serializers import (
    MediaSerializer
)

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