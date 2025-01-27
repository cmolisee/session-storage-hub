import json
import os
from pathlib import Path
from typing import Dict

from jkpy.jiraHandler import JiraHandler
from jkpy.utils import clean_folder_path, sys_exit

class ConfigHandler(JiraHandler):
    def handle(self, request):
        request.log("ConfigHandler().handle().")
        if not request.proceed:
            sys_exit(0, request, "request.proceed is False. Exiting.")
        
        config: Dict[str, any]=self.get_config(request)

        if request.showConfig:
            print(json.dumps(config, indent=4, sort_keys=True))
            sys_exit(0, request, "show configs only.")

        if request.email:
            request.log(f"updating email from {config["email"]} to {request.email}")
            config["email"]=request.email
        else:
            request.email=config.get("email", "")

        if request.token:
            request.log(f"updating token from {config["token"]} to {request.token}")
            config["token"]=request.token
        else:
            request.token=config.get("token", "")

        if request.folderPath:
            request.log(f"updating and creating folderPath from {config["folderPath"]} to {request.folderPath}")
            cleanPath=clean_folder_path(request.folderPath) # clean and get folderPath as PosixPath
            cleanPath.mkdir(parents=True, exist_ok=True) # make folder as needed
            config["folderPath"]=str(cleanPath) # convert path to string to store in config
        else:
            request.folderPath=config.get("folderPath", os.path.join(Path.home(), "Desktop"))

        if request.teamLabels and len(request.teamLabels) > 0:
            request.log(f"adding team labels {", ".join(request.teamLabels)}.")
            teamLabelsSet=set(config.get("teamLabels", [])) # get existing config as a set
            teamLabelsSet.update(request.teamLabels.split(",")) # update set with values from request
            config["teamLabels"]=list(teamLabelsSet) # set config
            request.teamLabels=list(teamLabelsSet) # set reqeust
        else:
            request.teamLabels=config.get("teamLabels", [])

        if request.nameLabels and len(request.nameLabels) > 0:
            request.log(f"adding name labels {", ".join(request.nameLabels)}.")
            nameLabelsSet=set(config.get("nameLabels", [])) # get existing config as a set
            nameLabelsSet.update(request.nameLabels.split(",")) # update set with values from request
            config["nameLabels"]=list(nameLabelsSet) # set config
            request.nameLabels=list(nameLabelsSet) # set reqeust
        else:
            request.nameLabels=config.get("nameLabels", [])

        if request.statusTypes and len(request.statusTypes) > 0:
            request.log(f"adding status types {", ".join(request.statusTypes)}.")
            statusTypesSet=set(config.get("statusTypes", [])) # get existing config as a set
            statusTypesSet.update(request.statusTypes.split(",")) # update set with values from request
            config["statusTypes"]=list(statusTypesSet) # set config
            request.statusTypes=list(statusTypesSet) # set reqeust
        else:
            request.statusTypes=config.get("statusTypes", [])

        if request.remove_teamLabels and len(request.remove_teamLabels) > 0:
            request.log(f"removing team labels {", ".join(request.remove_teamLabels)}.")
            teamLabelsList=config.get("teamLabels", []) # updated labels are in the config
            # filter out all items to remove into a new list
            updatedTeamLabels=[label for label in teamLabelsList if label not in request.remove_teamLabels.split(",")]
            config["teamLabels"]=updatedTeamLabels # update config
            request.teamLabels=updatedTeamLabels # update request

        if request.remove_nameLabels and len(request.remove_nameLabels) > 0:
            request.log(f"removing name labels {", ".join(request.remove_nameLabels)}.")
            nameLabelsArray=config.get("nameLabels", []) # updated labels are in the config
            # filter out all items to remove into a new list
            updatedNameLabels=[label for label in nameLabelsArray if label not in request.remove_nameLabels.split(",")]
            config["nameLabels"]=updatedNameLabels # update config
            request.nameLabels=updatedNameLabels # update request

        if request.remove_statusTypes and len(request.remove_statusTypes) > 0:
            request.log(f"removing status types {", ".join(request.remove_statusTypes)}.")
            statusTypesArray=config.get("statusTypes", []) # updated labels are in the config
            # filter out all items to remove into a new list
            updatedStatusTypes=[status for status in statusTypesArray if status not in request.remove_statusTypes.split(",")]
            config["statusTypes"]=updatedStatusTypes # update config
            request.statusTypes=updatedStatusTypes # update request

        self.write_update_config(config, request)
        if request.isSetup:
            sys_exit(0, request, "config setup only.")

        return super().handle(request)
    
    def get_config(self, request):
        configPath=Path(os.path.join(Path.home(), "Documents/.jkpy/config.txt"))
        configPath.parent.mkdir(parents=True, exist_ok=True)
        
        if not configPath.exists():
            request.log(f"config file did not exist. creating new config at {configPath}.")
            configPath.touch()
        
        try:
            with configPath.open("r") as f:
                data=f.read()
           
            return {} if data == "" else json.loads(data)
        except Exception as e:
            sys_exit(1, request, f"exception occured attempting to open and READ the config file: {e}")
    
    def write_update_config(self, config, request):
        configPath=Path(os.path.join(Path.home(), "Documents/.jkpy/config.txt"))
        configPath.parent.mkdir(parents=True, exist_ok=True)
        
        if not configPath.exists():
            request.log(f"config file did not exist. creating new config at {configPath}.")
            configPath.touch()
        
        try:
            with configPath.open("w") as f:
                f.write(json.dumps(config))
        except Exception as e:
            sys_exit(1, request, f"exception occured attempting to open and WRITE the config file: {e}")
