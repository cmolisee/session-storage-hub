"""request class"""
# jkpy/jira_requests.py

from requests.auth import HTTPBasicAuth
from rich.console import Console
import requests
import urllib3

urllib3.disable_warnings()
console = Console()

class jiraRequest:    
    def __init__(self, headers: dict = {}):
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
        # or issues[n].fields.aggregateprogress.progress (in seconds)
    def get_my_filters(self, email: str, token: str):
        """Make request for user filters"""
        auth = HTTPBasicAuth(email, token)
        response = requests.request(
            "GET",
            "https://creditonebank.atlassian.net/rest/api/3/filter/my",
            headers=self.headers,
            auth=auth,
            verify=False,
        )
        
        if response.status_code != 200:
            raise Exception("Error requesting filters: ", response)
        
        return response.text
    
    def get_issues_by_jql(self, raw_jql: str, email: str, token: str):
        """Make request with JQL"""
        auth = HTTPBasicAuth(email, token)
        query = {
            # 'jql': urllib.parse.quote(raw_jql),
            'jql': raw_jql,
            'maxResults': '5000',
            'fields': '*all',
        }
        
        response = requests.request(
            "GET",
            f"https://creditonebank.atlassian.net/rest/api/3/search/jql",
            headers=self.headers,
            params=query,
            auth=auth,
            verify=False,
        )
        
        if response.status_code != 200:
            raise Exception("Error requesting issues: ", response)
        
        return response.text