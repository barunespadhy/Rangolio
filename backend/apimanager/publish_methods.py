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

    deploy_location = settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]+'/ghpages'
    copy_data_and_html('ghpages')
    print("All data and HTML successfully copied to target folder")
    if not os.path.exists(f'{deploy_location}/.git'):
        try:
            existing_repo = draw_dialogue_box(
                'Github Deploy',
                'Do you have an existing repository with Rangolio on github?',
                'confirmation'
            )
            if existing_repo:
                git_existing_repo_setup(deploy_location)
            else:
                github_init(deploy_location)

            github_pages_deploy(deploy_location)
            return {'message': 'Github deployment successful', 'status': status.HTTP_200_OK}
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return {'message': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR}

    else:
        try:
            github_pages_deploy(deploy_location)
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
