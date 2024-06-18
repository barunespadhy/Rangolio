from django.conf import settings
import os
import shutil
import subprocess
import tkinter as tk
from rest_framework import status
from tkinter import simpledialog
from tkinter import messagebox
import urllib.parse

deployment_methods = {
    "server_deploy": {
        "name": "Server Deploy"
    },
    "github_deploy": {
        "name": "Github Deploy"
    }
}

def invokeDialogueBox(title, message, type):
    root = tk.Tk()
    root.withdraw()

    input_data = None
    if type == 'text':
        input_data = simpledialog.askstring(title, message)
    if type == 'password':
        input_data = simpledialog.askstring(title, message, show='*')
    if type == 'yesno':
        input_data = messagebox.askyesno(title, message)
    if type == 'message':
        messagebox.showinfo(title, message)

    root.destroy()
    return input_data

def copyData(data_location, deploy_location):
    if not os.path.exists(data_location):
        print("The source directory does not exist.")
    else:
        try:
            if os.path.exists(f'{deploy_location}/data'):
                shutil.rmtree(f'{deploy_location}/data')
            else:
                pass
            shutil.copytree(data_location, deploy_location, dirs_exist_ok=True)
            print(f"Data successfully deployed")
        except Exception as e:
            print(f"Error occurred: {e}")
def server_deploy():
    try:
        data_location = f'{settings.BASE_DIR}/deploy/'
        deploy_location = settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]+'/server'
        copyData(data_location, deploy_location)
        return {'message': 'Server deployment successful', 'status': status.HTTP_200_OK}
    except Exception as e:
        print (f"An error occurred: {str(e)}")
        return {'message': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR}

def github_deploy():
    print("Deploying via github")
    git_commands = {}
    git_commands["git_init"] = ['git', 'init']
    git_commands["git_add"] = ['git', 'add', '.']
    git_commands["git_pull"] = ['git', 'pull']
    git_commands["git_config_email"] = ['git', 'config', '--local', 'user.email']
    git_commands["git_config_name"] = ['git', 'config', '--local', 'user.name']
    git_commands["git_commit"] = ['git', 'commit', '-m', 'Update website']
    git_commands["git_branch"] = ['git', 'branch', '-m', 'main']
    git_commands["git_get_origin_url"] = ['git', 'remote', 'get-url', 'origin']
    git_commands["git_set_origin_url"] = ['git', 'remote', 'set-url', 'origin']
    git_commands["git_add_url"] = ['git', 'remote', 'add', 'origin']
    git_commands["git_push"] = ['git', 'push', '-u', 'origin', 'main']
    git_commands["git_clone"] = ['git', 'clone']

    data_location = f'{settings.BASE_DIR}/deploy/'
    deploy_location = settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]+'/ghpages'

    create_404_page(deploy_location)
    copyData(data_location, deploy_location)
    
    if not os.path.exists(f'{deploy_location}/.git'):
        try:

            existingRepo = invokeDialogueBox('Github Deploy', 'Do you have an existing repository with Rangolio on github?', 'yesno')
            if (existingRepo):
                git_existing_repo_setup(deploy_location, git_commands)
            else:
                github_init(deploy_location, git_commands)
            gh_pages_deploy(deploy_location, git_commands)
            return {'message': 'Github deployment successful', 'status': status.HTTP_200_OK}
        except Exception as e:
            print (f"An error occurred: {str(e)}")
            return {'message': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR}

    else:
        try:
            gh_pages_deploy(deploy_location, git_commands)
            return {'message': 'Github deployment successful', 'status': status.HTTP_200_OK}
        except Exception as e:
            print (f"An error occurred: {str(e)}")
            return {'message': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR}


def github_init(deploy_location, git_commands):
    user_details_defined = git_check_user_details(deploy_location, git_commands)
    if not user_details_defined:
        git_set_user_details(deploy_location, git_commands)
    username = invokeDialogueBox('Github Deploy', 'Enter your username', 'text')
    password = invokeDialogueBox('Github Deploy', 'Enter your github token', 'password')
    remote_url = f'https://{username}:{password}@github.com/{username}/{username}.github.io.git'

    subprocess.run(git_commands["git_init"], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run(git_commands["git_add"], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run(git_commands["git_commit"], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run(git_commands["git_branch"], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run((git_commands["git_add_url"]).append(remote_url), cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run(git_commands["git_push"], cwd=deploy_location, check=True, text=True, capture_output=True)

def git_set_user_details(deploy_location, git_commands):
    email = invokeDialogueBox('Github Deploy', 'Enter your github email', 'text')
    name = invokeDialogueBox('Github Deploy', 'Enter your name', 'text')
    subprocess.run(git_commands["git_config_email"] + [email], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run(git_commands["git_config_name"]+ [name], cwd=deploy_location, check=True, text=True, capture_output=True)

def git_existing_repo_setup(deploy_location, git_commands):

    repo_url = invokeDialogueBox('Github Deploy', 'Enter Repository URL', 'text')
    if not repo_url.endswith('.git'):
        repo_url = repo_url + '.git'

    dist_folder_name = ((repo_url.split('/')).pop()).removesuffix('.git')
    subprocess.run(git_commands["git_clone"] + [repo_url], cwd=settings.DEPLOY_CONFIG["DEPLOY_LOCATION"], check=True, text=True, capture_output=True)
    git_update_viewable_ui(deploy_location, dist_folder_name)

def git_check_user_details( deploy_location, git_commands):
    try:
        subprocess.run(git_commands["git_config_name"], cwd=deploy_location, check=True, text=True, capture_output=True)
        subprocess.run(git_commands["git_config_email"], cwd=deploy_location, check=True, text=True, capture_output=True)
        return True
    except Exception as e:
        return False


def git_update_viewable_ui(deploy_location, dist_folder_name, build_frontend=False):
    shutil.move(deploy_location, f'{deploy_location}.temp')
    if build_frontend:
        subprocess.run(["npm", 'run', 'build:ghpages'], cwd=settings.DEPLOY_CONFIG["VIEWABLE_UI_LOCATION"], check=True, text=True, capture_output=True)
    shutil.move(f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/{dist_folder_name}', f'{deploy_location}')
    shutil.copy(f'{deploy_location}.temp/index.html', deploy_location)
    shutil.copy(f'{deploy_location}.temp/404.html', deploy_location)
    shutil.copytree(f'{deploy_location}.temp/assets', f'{deploy_location}/assets', dirs_exist_ok=True)
    if os.path.exists(f'{deploy_location}.temp/data'):
        shutil.copytree(f'{deploy_location}.temp/data', f'{deploy_location}/data', dirs_exist_ok=True)
    shutil.rmtree(f'{deploy_location}.temp')

def gh_pages_deploy(deploy_location, git_commands):
    user_details_defined = git_check_user_details(deploy_location, git_commands)
    if not user_details_defined:
        git_set_user_details(deploy_location, git_commands)
    subprocess.run(git_commands["git_pull"], cwd=deploy_location, check=True, text=True, capture_output=True)
    print("completed git pull")
    origin_url_subprocess = subprocess.run(git_commands["git_get_origin_url"], cwd=deploy_location, check=True, text=True, capture_output=True)
    origin_url = origin_url_subprocess.stdout.strip()
    print("Got origin as "+str(origin_url))
    parsed_url = urllib.parse.urlparse(origin_url)
    print(parsed_url)
    if not '@' in parsed_url.netloc:
        username = invokeDialogueBox('Github Deploy', 'Enter your username', 'text')
        password = invokeDialogueBox('Github Deploy', 'Enter your github token', 'password')
        netloc = f"{username}:{password}@{parsed_url.hostname}"
        new_url = urllib.parse.urlunparse(parsed_url._replace(netloc=netloc))
        subprocess.run(git_commands["git_set_origin_url"] + [new_url], cwd=deploy_location, check=True, text=True, capture_output=True)
        print("Origin URL changed")
    subprocess.run(git_commands["git_add"], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run(git_commands["git_commit"], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run(git_commands["git_push"], cwd=deploy_location, check=True, text=True, capture_output=True)


def create_404_page(deploy_location):
    html_content = """
    <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Rangoio</title>
                <script type="text/javascript">
                    var pathSegmentsToKeep = 0;
                    var l = window.location;
                    l.replace(
                        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
                        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
                        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
                        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
                        l.hash
                    );
                </script>
            </head>
            <body>
            </body>
        </html>
    """

    with open(f'{deploy_location}/404.html', 'w') as file:
        file.write(html_content)

    print("404 page created successfully.")