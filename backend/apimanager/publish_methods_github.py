from django.conf import settings
import os
import shutil
import subprocess
import urllib.parse

from .dialogue_box import (
    draw_dialogue_box
)


def github_init(deploy_location, git_commands):
    user_details_defined = git_check_user_details(deploy_location, git_commands)
    if not user_details_defined:
        git_set_user_details(deploy_location, git_commands)
    
    username, password = git_get_username_password()
    remote_url = f'https://{username}:{password}@github.com/{username}/{username}.github.io.git'

    subprocess.run(git_commands["git_init"], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run(git_commands["git_add"], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run(git_commands["git_commit"], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run(git_commands["git_branch"], cwd=deploy_location, check=True, text=True, capture_output=True)
    subprocess.run((git_commands["git_add_url"]).append(remote_url), cwd=deploy_location, check=True, text=True,
                   capture_output=True)
    subprocess.run(git_commands["git_push"], cwd=deploy_location, check=True, text=True, capture_output=True)


def git_set_user_details(deploy_location, git_commands):
    while True:
        email = draw_dialogue_box('Github Deploy', 'Enter your github email', 'textbox')
        name = draw_dialogue_box('Github Deploy', 'Enter your name', 'textbox')
        input_confirmation = draw_dialogue_box(
            'Github Deploy',
            'Entered Information:\n'+'Name: '+name+'\n'+'Email: '+email+'\nPress "No" to re-enter details',
            'confirmation'
        )
        if input_confirmation:
            break
    subprocess.run(git_commands["git_config_email"] + [email], cwd=deploy_location, check=True, text=True,
                   capture_output=True)
    subprocess.run(git_commands["git_config_name"] + [name], cwd=deploy_location, check=True,
                   text=True, capture_output=True)


def git_existing_repo_setup(deploy_location, git_commands):

    while True:
        repo_url = draw_dialogue_box('Github Deploy', 'Enter Repository URL', 'textbox')
        input_confirmation = draw_dialogue_box(
            'Github Deploy',
            'Entered Information:\n'+'Repo URL: '+repo_url+'\nPress "No" to re-enter details',
            'confirmation'
        )
        if input_confirmation:
            break
    if not repo_url.endswith('.git'):
        repo_url = repo_url + '.git'

    dist_folder_name = ((repo_url.split('/')).pop()).removesuffix('.git')
    subprocess.run(git_commands["git_clone"] + [repo_url], cwd=settings.DEPLOY_CONFIG["DEPLOY_LOCATION"], check=True,
                   text=True, capture_output=True)
    git_update_viewable_ui(deploy_location, dist_folder_name)


def git_check_user_details(deploy_location, git_commands):
    try:
        subprocess.run(git_commands["git_config_name"], cwd=deploy_location, check=True, text=True, capture_output=True)
        subprocess.run(git_commands["git_config_email"], cwd=deploy_location, check=True, text=True, capture_output=True)
        return True
    except:
        return False


def git_update_viewable_ui(deploy_location, dist_folder_name, build_frontend=False):
    shutil.move(deploy_location, f'{deploy_location}.temp')
    if build_frontend:
        subprocess.run(["npm", 'run', 'build:ghpages'], cwd=settings.DEPLOY_CONFIG["VIEWABLE_UI_LOCATION"], check=True,
                       text=True, capture_output=True)
    shutil.move(f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/{dist_folder_name}', f'{deploy_location}')
    shutil.copy(f'{deploy_location}.temp/index.html', deploy_location)
    shutil.copy(f'{deploy_location}.temp/404.html', deploy_location)
    shutil.copytree(f'{deploy_location}.temp/assets', f'{deploy_location}/assets', dirs_exist_ok=True)
    if os.path.exists(f'{deploy_location}.temp/data'):
        shutil.copytree(f'{deploy_location}.temp/data', f'{deploy_location}/data', dirs_exist_ok=True)
    shutil.rmtree(f'{deploy_location}.temp')
    
    
def git_get_username_password():
    while True:
        username = draw_dialogue_box('Github Deploy', 'Enter your username', 'textbox')
        password = draw_dialogue_box('Github Deploy', 'Enter your github token', 'password')
        input_confirmation = draw_dialogue_box(
            'Github Deploy',
            'Entered Information:\n'+'Username: '+username+'\n'+'Password: '+password*len(password)
            + '\nPress "No" to re-enter details',
            'confirmation'
        )
        if input_confirmation:
            break
    return username, password


def github_pages_deploy(deploy_location, git_commands):
    user_details_defined = git_check_user_details(deploy_location, git_commands)
    if not user_details_defined:
        git_set_user_details(deploy_location, git_commands)
    subprocess.run(git_commands["git_pull"], cwd=deploy_location, check=True, text=True, capture_output=True)
    print("completed git pull")
    origin_url_subprocess = subprocess.run(git_commands["git_get_origin_url"], cwd=deploy_location, check=True,
                                           text=True, capture_output=True)
    origin_url = origin_url_subprocess.stdout.strip()
    print("Got origin as "+str(origin_url))
    parsed_url = urllib.parse.urlparse(origin_url)
    print(parsed_url)
    if not '@' in parsed_url.netloc:
        username = draw_dialogue_box('Github Deploy', 'Enter your username', 'textbox')
        password = draw_dialogue_box('Github Deploy', 'Enter your github token', 'password')
        netloc = f"{username}:{password}@{parsed_url.hostname}"
        new_url = urllib.parse.urlunparse(parsed_url._replace(netloc=netloc))
        subprocess.run(git_commands["git_set_origin_url"] + [new_url], cwd=deploy_location, check=True, text=True,
                       capture_output=True)
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
    