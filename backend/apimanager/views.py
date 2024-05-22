#######################Django related imports####################
import os
import subprocess
import ast
import shutil
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, permissions, views, serializers, status
#################################################################
#API related imports
from .models import (
	UserData, 
	Category, 
	Blog
)
from .serializers import (
    UserDataSerializer,
    ThemeDataSerializer,
	CategorySerializer,
    BlogSerializer,
    MediaSerializer
)
################################################################
#Custom Imports
from .MediaHandler import (
    MediaHandler,
)

#UserData related views#############################################
class UserDataUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDataSerializer

    def get_object(self):
        obj, created = UserData.objects.get_or_create(pk=1)
        return obj

class UserDataListAPIView(generics.ListAPIView):
    queryset            = UserData.objects.all()
    serializer_class    = UserDataSerializer
#####################################################################

#ThemeData related views#############################################
class ThemeDataUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ThemeDataSerializer

    def get_object(self):
        obj, created = UserData.objects.get_or_create(pk=1)
        return obj

class ThemeDataListAPIView(generics.ListAPIView):
    queryset            = UserData.objects.all()
    serializer_class    = ThemeDataSerializer
#####################################################################

#Category related views#############################################
class CategoryCreateAPIView(generics.CreateAPIView):
    queryset            = Category.objects.all()
    serializer_class    = CategorySerializer
    lookup_field        = 'category_id'

class CategoryUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset            = Category.objects.all()
    serializer_class    = CategorySerializer
    lookup_field        = 'category_id'

class CategoryListAPIView(generics.ListAPIView):
    queryset            = Category.objects.all()
    serializer_class    = CategorySerializer

class CategoryDeleteAPIView(generics.DestroyAPIView):
    queryset            = Category.objects.all()
    serializer_class    = CategorySerializer
    lookup_field        = 'category_id'
################################################################

#Blog related views##################################################
class BlogCreateAPIView(generics.CreateAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer
    lookup_field        = 'blog_id'

class BlogUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer
    lookup_field        = 'blog_id'

class BlogRetrieveAPIView(generics.RetrieveAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer
    lookup_field        = 'blog_id'

class BlogsByCategoryAPIView(APIView):
    def get(self, request, category_id):
        try:
            category = Category.objects.get(category_id=category_id)
        except Category.DoesNotExist:
            return Response({'message': 'Category not found'}, status=404)
        
        blogs = category.blogs.all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)

class BlogDeleteAPIView(generics.DestroyAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer
    lookup_field        = 'blog_id'
####################################################################

'''
class MediaView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_serializer = FileSerializer(data=request.data)
        if file_serializer.is_valid():
            files = dict((f, f) for f in request.FILES.getlist('file'))
            nodeName = file_serializer.validated_data['nodeName']
            preferredFormat = file_serializer.validated_data['preferredFormat']
            for f in files.values():
                fileHandlerObject = FileHandler(f, preferredFormat, nodeName)
                fileProcessed = fileHandlerObject.handleUploadedFile()
                if not fileProcessed[0]:
                    return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response(file_serializer.data, status=status.HTTP_201_CREATED)


            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ETLFunctions(GenericAPIView):

    serializer_class = ETLData

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data
        if data['operation'] == "create-folder":
            os.mkdir('../Analysis/'+data['postData'])
            with open('../Analysis/'+data['postData']+'/'+data['postData']+'-run.log', 'w') as fp:
                pass
            fp.close()

        if data['operation'] == "rename-folder":
            os.rename('../Analysis/'+data['oldTitle'], '../Analysis/'+data['postData'])

        if data['operation'] == "create-partition-file":
            print(os.getcwd())
            print(os.listdir(os.getcwd()))
            partInfo = (data['postData'].split('|'))
            with open(f'"{partInfo[0]}.part"', "w") as fpp:
                pass
            fpp.close()
            partitionFile = open(f'"{partInfo[0]}.part"', "w+")
            partitionFile.write(partInfo[1])
            partitionFile.close()

        if data['operation'] == "move-file":
            pass
                
        return Response("Success", status=status.HTTP_200_OK)

class BioTools(APIView):
    def get(self, request):
        params = request.GET.get('function', '')
        params = params.split(";")
        output = subprocess.check_output(f'seqmagick extract-ids ../Analysis/"{params[1]}"/"{(params[2])[:-1]}"', shell=True)
        outgroups = (output.decode("utf-8")).split('\n')
        outgroups = outgroups[:len(outgroups)-1]
        return Response({'outgroups': outgroups})

class CommandRunner(GenericAPIView):

    serializer_class = InterimData

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data
        runLogFile = f'../Analysis/{data["nodeName"]}/{data["nodeName"]}-run.log'
        
        try:
            commands = ast.literal_eval(data['finalParameter'])
            for key, value in commands.items():
                process = subprocess.Popen(value+f" > {runLogFile}", shell=True)
        except:
            process = subprocess.Popen(data['finalParameter']+f" > {runLogFile}", shell=True)
        return Response("Command successfully sent for execution", status=status.HTTP_200_OK)
'''