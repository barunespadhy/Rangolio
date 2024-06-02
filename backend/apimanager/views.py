#######################Django related imports####################
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from rest_framework import generics, status
import random
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
    UnifiedCategoryBlogSerializer,
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

class BlogsByCategoryAPIView(APIView):
    def get(self, request, category_id):
        try:
            category = Category.objects.get(category_id=category_id)
        except Category.DoesNotExist:
            return Response({'message': 'Category not found'}, status=404)

        serializer = UnifiedCategoryBlogSerializer(category)
        return Response(serializer.data)
################################################################

#Blog related views##################################################
class BlogCreateAPIView(generics.CreateAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer

class BlogUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer
    lookup_field        = 'blog_id'

class BlogRetrieveAPIView(generics.RetrieveAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer
    lookup_field        = 'blog_id'

class BlogDeleteAPIView(generics.DestroyAPIView):
    queryset            = Blog.objects.all()
    serializer_class    = BlogSerializer
    lookup_field        = 'blog_id'
####################################################################


class MediaUpload(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_serializer = MediaSerializer(data=request.data)
        if file_serializer.is_valid():
            files = request.FILES.getlist('media')
            resource_type = file_serializer.validated_data['resource_type']
            resource_id = file_serializer.validated_data['resource_id']
            file_path_base = f'static/rangolio_data'

            for f in files:
                file_unique_slug = ''.join(random.choices('ABCDEabcde1234', k=5))
                file_path = f"{file_path_base}/{resource_type}/{resource_id}/media/{file_unique_slug+resource_id+f.name}"
                default_storage.save(file_path, f)

            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



'''
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