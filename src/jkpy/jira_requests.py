"""request class"""
# jkpy/jira_requests.py

import json
from requests.auth import HTTPBasicAuth
from rich.console import Console
import requests
import urllib3

urllib3.disable_warnings()
console = Console()

class jiraRequest:    
    def __init__(self, headers: dict = {}):
        """Initialize object"""
        self.headers = {
            "Accept": "application/json",
            **headers
        }
        
    # assignee: issues[n].fields.assignee.displayName
    # created: issues[n].fields.created
    # approvers: issues[n].fields.customfield_10003
    # epic: issues[n].fields.customfield_10014
    # teamName: issues[n].fields.customfield_10235
    # productOwner: issues[n].fields.customfield_10303
    # acceptance criteria: issues[n].fields.customfield_10157
    # fix version: issues[n].fields.fixVersion[n].name,releaseDate
    # labels: issues[n].fields.labels
    # status: issues[n].fields.status.name
    # summary: issues[n].fields.summary
    # key (ticket number): issues[n].fields.key
    # sprint number: issues[n].fields.customfield_10020[n].name
    # story points: issues[n].fields.customfield_10028
    # time tracking: issues[n].fields.timespent (in seconds)
    #   or issues[n].fields.aggregateprogress.progress (in seconds)
    def _request(self, params, auth):
        res = requests.request(
                "GET",
                f"https://creditonebank.atlassian.net/rest/api/2/search/jql",
                headers=self.headers,
                params=params,
                auth=auth,
                verify=False,
            )
        
        if res.status_code != 200:
                raise Exception("Error requesting issues: ", res)
            
        return json.loads(res.text)
    
    def request(self, raw_jql: str, email: str, token: str):
        """Make request with JQL"""
        issues = []
        nextPageToken = None
        auth = HTTPBasicAuth(email, token)
        
        while True:
            query = {
                'jql': raw_jql,
                'fields': '*all',
                'nextPageToken': nextPageToken,
            }
            
            data = self._request(query, auth)
            issues += data.get("issues")
            nextPageToken = data.get("nextPageToken")
            
            if not nextPageToken:
                break;
        
        return issues