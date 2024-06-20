from django.conf import settings
import os
from rest_framework import status

from .utilities import (
    copy_content
)

from .dialogue_box import (
    draw_dialogue_box
)

from .publish_methods_github import (
    git_existing_repo_setup,
    github_init,
    github_pages_deploy
)

deployment_methods = {
    "server": {
        "name": "Server Deploy"
    },
    "ghpages": {
        "name": "Github Deploy"
    }
}


def server_deploy():
    try:
        copy_data_and_html('server')
        return {'message': 'Server deployment successful', 'status': status.HTTP_200_OK}
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return {'message': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR}


def github_deploy():
    print("Deploying via github")
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

    deploy_location = settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]+'/ghpages'
    copy_data_and_html('ghpages')
    if not os.path.exists(f'{deploy_location}/.git'):
        try:
            existing_repo = draw_dialogue_box(
                'Github Deploy',
                'Do you have an existing repository with Rangolio on github?',
                'confirmation'
            )
            if existing_repo:
                git_existing_repo_setup(deploy_location, git_commands)
            else:
                github_init(deploy_location, git_commands)
            github_pages_deploy(deploy_location, git_commands)
            return {'message': 'Github deployment successful', 'status': status.HTTP_200_OK}
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return {'message': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR}

    else:
        try:
            github_pages_deploy(deploy_location, git_commands)
            return {'message': 'Github deployment successful', 'status': status.HTTP_200_OK}
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return {'message': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR}


def copy_data_and_html(deploy_type):
    copy_content(
        settings.DEPLOY_CONFIG["EDITOR_DATA_LOCATION"],
        f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/{deploy_type}/data',
        'folder',
        'remove_and_copy'
    )
    copy_content(
        f'{settings.DEPLOY_CONFIG["EDITOR_HTML_LOCATION"]}/categories',
        f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/{deploy_type}/categories',
        'folder',
        'remove_and_copy'
    )
    copy_content(
        f'{settings.DEPLOY_CONFIG["EDITOR_HTML_LOCATION"]}/blog',
        f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/{deploy_type}/blog',
        'folder',
        'remove_and_copy'
    )
