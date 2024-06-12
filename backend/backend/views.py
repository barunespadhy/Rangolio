from django.shortcuts import render

def index(request, website_slug=None):
    return render(request, "index.html")