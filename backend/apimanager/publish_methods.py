from django.conf import settings
import os
import shutil

deployment_methods = {
    "server_deploy": {
        "name": "Server Deploy"
    },
    "github_deploy": {
        "name": "Github Deploy"
    }
}

def server_deploy():
    data_location = f'{settings.BASE_DIR}/deploy/'
    deploy_location = settings.DEPLOY_CONFIG["DEPLOY_LOCATION"]
    if not os.path.exists(data_location):
        print("The source directory does not exist.")
    else:
        try:
            shutil.rmtree(f'{deploy_location}/data')
            shutil.copytree(data_location, deploy_location, dirs_exist_ok=True)
            print(f"Data successfully deployed")
        except Exception as e:
            print(f"Error occurred: {e}")
    
    
def github_deploy():
    server_deploy()
    print("Deploying via github")