import os
import shutil
import subprocess


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


def run_git_command(operation, deploy_location, parameter=None):
    if not parameter:
        parameter=[]
    git_commands = {
        "git_init": ['git', 'init'],
        "git_add": ['git', 'add', '.'],
        "git_pull": ['git', 'pull'],
        "git_config_email": ['git', 'config', '--local', 'user.email'],
        "git_config_name": ['git', 'config', '--local', 'user.name'],
        "git_commit": ['git', 'commit', '-m', 'Update website'],
        "git_branch": ['git', 'branch', '-m', 'main'],
        "git_get_origin_url": ['git', 'remote', 'get-url', 'origin'],
        "git_set_origin_url": ['git', 'remote', 'set-url', 'origin'],
        "git_add_url": ['git', 'remote', 'add', 'origin'],
        "git_push": ['git', 'push', '-u', 'origin', 'main'],
        "git_clone": ['git', 'clone']
    }
    try:
        subprocess_operation = subprocess.run(git_commands[operation] + parameter, cwd=deploy_location, check=True, text=True, capture_output=True)
        subprocess_output = subprocess_operation.stdout.strip()
    except subprocess.CalledProcessError as e:
        subprocess_output = None

    return subprocess_output
