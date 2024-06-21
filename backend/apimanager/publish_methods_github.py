from django.conf import settings
import shutil
import subprocess
import urllib.parse

from .utilities import (
    copy_content,
    run_git_command
)

from .dialogue_box import (
    draw_dialogue_box
)


def github_init(deploy_location):
    user_details_defined = git_check_user_details(deploy_location)
    if not user_details_defined:
        git_set_user_details(deploy_location)
    
    username, password = git_get_username_password()
    remote_url = f'https://{username}:{password}@github.com/{username}/{username}.github.io.git'

    run_git_command('git_init', deploy_location)
    run_git_command('git_add', deploy_location)
    run_git_command('git_commit', deploy_location)
    run_git_command('git_branch', deploy_location)
    run_git_command('git_add_url', deploy_location, [remote_url])
    run_git_command('git_push', deploy_location)


def git_set_user_details(deploy_location):
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

    run_git_command('git_config_email', deploy_location, [email])
    run_git_command('git_config_name', deploy_location, [name])


def git_existing_repo_setup(deploy_location):

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
    run_git_command('git_clone', settings.DEPLOY_CONFIG["DEPLOY_LOCATION"], [repo_url])
    git_update_viewable_ui(deploy_location, dist_folder_name)


def git_check_user_details(deploy_location):
    config_email = run_git_command('git_config_name', deploy_location)
    config_name = run_git_command('git_config_email', deploy_location)
    if not config_email['subprocess_output'] or not config_name['subprocess_output']:
        return False
    return True


def git_update_viewable_ui(deploy_location, dist_folder_name):
    shutil.move(deploy_location, f'{deploy_location}.temp')

    shutil.move(f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/{dist_folder_name}', f'{deploy_location}')

    copy_content(
        f'{deploy_location}.temp/index.html',
        deploy_location,
        'file',
        'remove_and_copy'
    )
    copy_content(
        f'{deploy_location}.temp/assets',
        f'{deploy_location}/assets',
        'folder',
        'remove_and_copy'
    )
    copy_content(
        f'{deploy_location}.temp/data',
        f'{deploy_location}/data',
        'folder',
        'remove_and_copy'
    )
    copy_content(
        f'{deploy_location}.temp/categories',
        f'{deploy_location}/categories',
        'folder',
        'remove_and_copy'
    )
    copy_content(
        f'{deploy_location}.temp/blog',
        f'{deploy_location}/blog',
        'folder',
        'remove_and_copy'
    )

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


def github_pages_deploy(deploy_location):
    user_details_defined = git_check_user_details(deploy_location)
    if not user_details_defined:
        git_set_user_details(deploy_location)

    user_email = run_git_command("git_config_email", deploy_location)
    user_name = run_git_command("git_config_name", deploy_location)
    repo_name = run_git_command("git_get_origin_url", deploy_location).split("/").pop()

    deploy_confirmation = draw_dialogue_box(
        'Github Deploy',
        f'Deploying as {user_name.subprocess_output} with email {user_email.subprocess_output} to {repo_name.subprocess_output}',
        'confirmation'
    )

    if deploy_confirmation:
        run_git_command('git_pull', deploy_location)
        print("completed git pull")
        origin_url = run_git_command('git_get_origin_url', deploy_location)
        print("Got origin as "+str(origin_url.subprocess_output))
        parsed_url = urllib.parse.urlparse(origin_url.subprocess_output)
        print(parsed_url)
        if not '@' in parsed_url.netloc:
            username = draw_dialogue_box('Github Deploy', 'Enter your username', 'textbox')
            password = draw_dialogue_box('Github Deploy', 'Enter your github token', 'password')
            netloc = f"{username}:{password}@{parsed_url.hostname}"
            new_url = urllib.parse.urlunparse(parsed_url._replace(netloc=netloc))
            run_git_command('git_set_origin_url', deploy_location, [new_url])
            print("Origin URL changed")
        run_git_command('git_add', deploy_location)
        run_git_command('git_commit', deploy_location)
        run_git_command('git_push', deploy_location)
    else:
        raise subprocess.CalledProcessError(1, 'failed', 'Deployment Cancelled')
