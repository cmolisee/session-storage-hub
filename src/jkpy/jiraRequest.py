"""request object passed through handlers"""
#  jkpy/jiraRequest.py

from datetime import datetime

class JiraRequest:
    def __init__(self, requestConfig={}):
        """setup requestConfig values"""
        self.email=requestConfig.get("email", None)
        self.token=requestConfig.get("token", None)
        self.folderPath=requestConfig.get("folderPath", None)
        self.teamLabels=requestConfig.get("teamLabels", None)
        self.nameLabels=requestConfig.get("nameLabels", None)
        self.statusTypes=requestConfig.get("statusTypes", None)
        self.remove_teamLabels=requestConfig.get("remove_teamLabels", None)
        self.remove_nameLabels=requestConfig.get("remove_nameLabels", None)
        self.remove_statusTypes=requestConfig.get("remove_statusTypes", None)

        """setup requestConfig values for single jql run"""
        self.isUpdate=requestConfig.get("update", True)
        self.startDate=requestConfig.get("startDate", None)
        self.endDate=requestConfig.get("endDate", None)

        """setup handler control/flow"""
        self.isSetup=requestConfig.get("isSetup", False)
        self.proceed=True
        self.logs=[]
        self.requestData=None
        self.responseData=None
        self.metrics=None
        self.timestamp=int(datetime.now().timestamp())
        self.showConfig=requestConfig.get("showConfig", False)

    def __str__(self):
        return f"""JiraRequest(
            email={self.email},
            token={self.token},
            folderPath={self.folderPath},
            teamLabels={self.teamLabels},
            nameLabels={self.nameLabels},
            statusTypes={self.statusTypes},
            remove_teamLabels={self.remove_teamLabels},
            remove_nameLabels={self.remove_nameLabels},
            remove_statusTypes={self.remove_statusTypes},
            startDate={self.startDate},
            endDate={self.endDate},
            isSetup={self.isSetup},
            proceed={self.proceed},
            logs={self.logs},
            requestData={self.requestData},
            responseData={self.responseData},
            metrics={self.metrics},
            timestamp={self.timestamp},
            showConfig={self.showConfig}
        )"""

    def log(self, log):
        self.logs.append(f"[{self.timestamp}] {log}")