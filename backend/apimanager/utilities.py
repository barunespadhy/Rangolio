import os
import shutil


def copy_content(source, destination, content_type, copy_type='merge'):
    if not os.path.exists(source):
        print(f'The source {content_type} does not exist.')
    else:
        try:
            if content_type == 'folder':
                if copy_type == 'remove_and_copy' and os.path.exists(destination):
                    shutil.rmtree(destination)
                shutil.copytree(source, destination, dirs_exist_ok=True)
            else:
                if copy_type == 'remove_and_copy' and os.path.exists(destination):
                    os.remove(destination)
                shutil.copy(source, destination)
            print(f'{content_type} copied successfully from {source} to {destination}')
        except Exception as e:
            print(f'Error occurred: {e}')