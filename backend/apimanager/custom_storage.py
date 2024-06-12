from django.core.files.storage import FileSystemStorage

class CustomStorage(FileSystemStorage):
    def __init__(self, location=None, base_url=None):
        location = location or 'deploy/data/'
        base_url = base_url or ''
        super().__init__(location, base_url)
