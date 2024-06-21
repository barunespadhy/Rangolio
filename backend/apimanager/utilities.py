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


def run_git_command(operation, command_location, parameter=None):
    git_commands = {
        "git_init": ['git', 'init'],
        "git_add": ['git', 'add', '.'],
        "git_fetch_origin": ['git', 'fetch', 'origin'],
        "git_pull": ['git', 'pull'],
        "git_config_email": ['git', 'config', '--local', 'user.email'],
        "git_config_name": ['git', 'config', '--local', 'user.name'],
        "git_commit": ['git', 'commit', '-m', 'Update website'],
        "git_branch": ['git', 'branch', '-m', 'main'],
        "git_get_origin_url": ['git', 'remote', 'get-url', 'origin'],
        "git_set_origin_url": ['git', 'remote', 'set-url', 'origin'],
        "git_add_url": ['git', 'remote', 'add', 'origin'],
        "git_push": ['git', 'push', '-u', 'origin', 'main'],
        "git_clone": ['git', 'clone'],
        "git_diff": ['git', 'diff', 'origin/main']
    }
    return run_command(operation, command_location, git_commands, parameter)


def run_npm_command(operation, command_location, parameter=None):
    npm_commands = {
        "npm_install": ['npm', 'install', '-i'],
        "npm_run": ['npm', 'run'],
    }
    return run_command(operation, command_location, npm_commands, parameter)


def run_django_command(operation, command_location, parameter=None):
    npm_commands = {
        "collectstatic": ['python', 'manage.py', 'collectstatic', '--no-input'],
        "makemigrations": ['python', 'manage.py', 'makemigrations'],
        "migrate": ['python', 'manage.py', 'migrate'],
    }
    return run_command(operation, command_location, npm_commands, parameter)


def run_command(operation, command_location, command_map_list, parameter=None):
    if not parameter:
        parameter=[]

    try:
        subprocess_operation = subprocess.run(command_map_list[operation] + parameter, cwd=command_location, check=True, text=True, capture_output=True)
        subprocess_output = subprocess_operation.stdout.strip()
        subprocess_returncode = subprocess_operation.returncode
        subprocess_result = {'subprocess_output': subprocess_output, 'subprocess_returncode': subprocess_returncode}
        return subprocess_result
    except subprocess.CalledProcessError as e:
        return None
