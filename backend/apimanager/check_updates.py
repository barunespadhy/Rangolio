from django.conf import settings
import shutil

from .utilities import (
    copy_content,
    run_git_command,
    run_npm_command,
    run_django_command
)

from .publish_methods_github import (
    git_update_viewable_ui    
)

from .dialogue_box import (
    draw_dialogue_box    
)


def update_rangolio(rangolio_location):
    run_git_command('git_pull', rangolio_location)
    
    # Install dependencies and build viewable-ui
    run_npm_command('npm_install', f'{rangolio_location}/frontend/viewable-ui')
    
    # Update server
    shutil.move(settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]+'/server',
                f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/server.old')
    run_npm_command('npm_run', f'{rangolio_location}/frontend/viewable-ui', ['build:server'])
    git_update_viewable_ui(f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/server', 'server.old')
    
    # Update ghpages
    shutil.move(settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]+'/ghpages',
                f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/ghpages.old')
    
    run_npm_command('npm_run', f'{rangolio_location}/frontend/viewable-ui', ['build:ghpages'])
    git_update_viewable_ui(f'{settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]}/ghpages', 'ghpages.old')
    
    # Update editor-ui
    run_npm_command('npm_run', f'{rangolio_location}/frontend/editable-ui', ['build'])
    run_django_command('collectstatic', f'{rangolio_location}/backend')
    copy_content(
        f'{rangolio_location}/backend/static/index.html',
        f'{rangolio_location}/backend/templates/index.html',
        'file',
        'remove_and_copy'
    )
    run_django_command('makemigrations', f'{rangolio_location}/backend')
    run_django_command('migrate', f'{rangolio_location}/backend')
    
    
print ('Checking for updates')
rangolio_location = settings.DEPLOY_CONFIG["RANGOLIO_LOCATION"]

run_git_command('git_fetch_origin', rangolio_location)
updates = run_git_command('git_diff', rangolio_location, ['origin/development'])
print (updates)
if updates['subprocess_output'] and updates['subprocess_returncode'] == 0:
    update_confirmation = draw_dialogue_box('Software Update', 'Would you like to update rangolio?', 'confirmation')
    if update_confirmation:
        update_rangolio(rangolio_location)
else:
    print('No updates')