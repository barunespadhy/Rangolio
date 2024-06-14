from django.conf import settings
import os
import shutil
import subprocess
import tkinter as tk
from tkinter import simpledialog

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
    data_location = f'{settings.BASE_DIR}/deploy/'
    deploy_location = settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]+'/server'
    copyData(data_location, deploy_location)

def github_deploy():
    print("Deploying via github")
    git_commands = {}
    git_commands["git_init"] = ['git', 'init']
    git_commands["git_add"] = ['git', 'add', '.']
    git_commands["git_config_email"] = ['git', 'config', '--local', 'user.email']
    git_commands["git_config_name"] = ['git', 'config', '--local', 'user.name']
    git_commands["git_commit"] = ['git', 'commit', '-m', '"Update website"']
    git_commands["git_branch"] = ['git', 'branch', '-m', 'main']
    git_commands["git_add_url"] = ['git', 'remote', 'add', 'origin']
    git_commands["git_push"] = ['git', 'push', '-u', 'origin', 'main']

    data_location = f'{settings.BASE_DIR}/deploy/'
    deploy_location = settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]+'/ghpages'

    run_gh_build = ['npm', 'run', 'build:ghpages']

    subprocess.run(run_gh_build, cwd=settings.DEPLOY_CONFIG["DEPLOY_LOCATION"].replace('/dist', ''), check=True, text=True, capture_output=True)
    create_404_page(deploy_location)
    copyData(data_location, deploy_location)
    
    if not os.path.exists(f'{deploy_location}/.git'):
        github_init(deploy_location, git_commands)
        gh_pages_deploy(deploy_location, git_commands)
    else:
        gh_pages_deploy(deploy_location, git_commands)

def github_init(deploy_location, git_commands):
     email = invokeDialogueBox('Github Deploy', 'Enter your github email', 'text')
     name = invokeDialogueBox('Github Deploy', 'Enter your name', 'text')
     username = invokeDialogueBox('Github Deploy', 'Enter your username', 'text')
     password = invokeDialogueBox('Github Deploy', 'Enter your github token', 'password')
     remote_url = f'https://{username}:{password}@github.com/{username}/{username}.github.io.git'

     try:
         subprocess.run(git_commands["git_init"], cwd=deploy_location, check=True, text=True, capture_output=True)
         subprocess.run((git_commands["git_config_email"]).append(email), cwd=deploy_location, check=True, text=True, capture_output=True)
         subprocess.run((git_commands["git_config_name"]).append(name), cwd=deploy_location, check=True, text=True, capture_output=True)
         subprocess.run(git_commands["git_add"], cwd=deploy_location, check=True, text=True, capture_output=True)
         subprocess.run(git_commands["git_commit"], cwd=deploy_location, check=True, text=True, capture_output=True)
         subprocess.run(git_commands["git_branch"], cwd=deploy_location, check=True, text=True, capture_output=True)
         subprocess.run((git_commands["git_add_url"]).append(remote_url), cwd=deploy_location, check=True, text=True, capture_output=True)
         subprocess.run(git_commands["git_push"], cwd=deploy_location, check=True, text=True, capture_output=True)
     except subprocess.CalledProcessError as e:
         print (f"Failed to add remote: {e.stderr}")
     except Exception as e:
         print (f"An error occurred: {str(e)}")


def gh_pages_deploy(deploy_location, git_commands):
    try:
        subprocess.run(git_commands["git_add"], cwd=deploy_location, check=True, text=True, capture_output=True)
        subprocess.run(git_commands["git_commit"], cwd=deploy_location, check=True, text=True, capture_output=True)
        subprocess.run(git_commands["git_push"], cwd=deploy_location, check=True, text=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        return f"Failed to add remote: {e.stderr}"
    except Exception as e:
        return f"An error occurred: {str(e)}"


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