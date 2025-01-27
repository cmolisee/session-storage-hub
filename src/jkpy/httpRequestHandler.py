import json
import requests
import urllib3

from jkpy.jiraHandler import JiraHandler
from jkpy.utils import sys_exit

urllib3.disable_warnings()

class HttpRequestHandler(JiraHandler):
    """get request results"""
    def handle(self, request):
        request.log("HttpRequestHandler().handle().")
        if not request.proceed:
            sys_exit(0, request, "request.proceed is False. Exiting.")
        
        try:
            nextPageToken=None
            issues=[]
            
            while True:
                response=requests.request(
                    request.requestData.get("method"),
                    request.requestData.get("path"),
                    headers=request.requestData.get("headers"),
                    params={
                        "jql": request.requestData.get("query").get("jql"),
                        "fields": request.requestData.get("query").get("fields"),
                        'nextPageToken': nextPageToken,
                    },
                    auth=request.requestData.get("auth"),
                    verify=False,
                )

                if response.status_code != 200:
                    sys_exit(1, request, f"request failed with {response.status_code}.")

                data=json.loads(response.text)
                issues.extend(data.get("issues", []))
                nextPageToken=data.get("nextPageToken")

                
                if not nextPageToken:
                    request.log(f"jira request complete. {len(issues)} issues collected.")
                    break;

                request.log(f"nextPageToken: {nextPageToken}.")
                
            request.log(f"response data for {request.requestData.get("type")} has {len(issues)} issues")
            request.responseData={
                "type": request.requestData.get("type"),
                "issues": issues
            }

        except Exception as e:
            sys_exit(1, request, f"exception occured making jira request: {e}")
        
        return super().handle(request)
