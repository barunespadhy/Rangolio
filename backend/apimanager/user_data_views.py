#######################Django related imports####################
from rest_framework import generics, status
#################################################################
#API related imports
from .models import (
    UserData, 
)
from .serializers import (
    UserDataSerializer,
    ThemeDataSerializer,
)

class UserDataUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDataSerializer

    def get_object(self):
        obj, created = UserData.objects.get_or_create(pk=1)
        return obj

class UserDataListAPIView(generics.ListAPIView):
    queryset            = UserData.objects.all()
    serializer_class    = UserDataSerializer


class ThemeDataUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ThemeDataSerializer

    def get_object(self):
        obj, created = UserData.objects.get_or_create(pk=1)
        return obj

class ThemeDataListAPIView(generics.ListAPIView):
    queryset            = UserData.objects.all()
    serializer_class    = ThemeDataSerializer