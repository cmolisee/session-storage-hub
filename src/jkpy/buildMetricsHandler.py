from datetime import datetime, timedelta
import traceback
import pandas as pd
import calendar

from jkpy.jiraHandler import JiraHandler
from jkpy.utils import parse_date, sys_exit

class BuildMetricsHandler(JiraHandler):
    def handle(self, request):
        request.log("BuildMetricsHandler().handle().")
        if not request.proceed:
            sys_exit(0, request, "request.proceed is False. Exiting.")

        if not request.responseData:
            sys_exit(1, request, "request.responseData DNE.")

        try:
            df=pd.json_normalize(request.responseData.get("issues", []))
            targetYear=parse_date(request.startDate, 1, 1)[:4]
            metrics={}

            request.log(f"building annual metrics on full dataset.")
            metrics["annual"]=self.get_dataset_stats(df, f"{targetYear} - overall", True, request.nameLabels);
            
            for month in range(1, 12+1):
                monthName=calendar.month_name[month]
                request.log(f"building metrics for {monthName}")
                
                monthSubset=df[df["fields.statuscategorychangedate"].apply(lambda x: datetime.fromisoformat(x).month == month)]
                metrics[monthName]={}
                if month % 3:
                    metrics[monthName]["overall"]=self.get_dataset_stats(monthSubset, f"{monthName} (Q{int(month/3)}) - overall", True, request.nameLabels)
                else:
                    metrics[monthName]["overall"]=self.get_dataset_stats(monthSubset, f"{monthName} - overall")

                for n in request.nameLabels:
                    request.log(f"building metrics for name label {n}.")
                    nameSubset=monthSubset[monthSubset["fields.labels"].apply(lambda x: n in x)]
                    metrics[monthName][n]=self.get_dataset_stats(nameSubset, n)

                for t in request.teamLabels:
                    request.log(f"building metrics for team label {n}.")
                    teamSubset=monthSubset[monthSubset["fields.customfield_10235.value"].apply(lambda x: x == t)]
                    metrics[monthName][t]=self.get_dataset_stats(teamSubset, t)

        except Exception as e:
            sys_exit(1, request, f"exception occured building metrics from response data: {traceback.format_exc()}")
        
        request.metrics=metrics
        return super().handle(request)

    def get_dataset_stats(self, dataset: pd.DataFrame, datasetTitle: str, isMajorSet: bool=False, nameLabels=[]):
        stats={
            "datasetTitle": datasetTitle,
            "totalIssues": dataset.shape[0],
        }

        if stats.get("totalIssues") > 0:
            stats["storyPointSum"]=dataset["fields.customfield_10028"].sum()
            stats["totalTimeSpent"]=timedelta(seconds=int(dataset["fields.timespent"].apply(lambda x: x != None).sum()))
            stats["totalNoTrackging"]=dataset["fields.timespent"].isna().sum()
            stats["totalEnhancement"]=dataset[dataset["fields.labels"].apply(lambda x: "Enhancement" in x)].shape[0]
            stats["totalBugs"]=dataset[dataset["fields.labels"].apply(lambda x: "Bug" in x)].shape[0]
            stats["totalDefects"]=dataset[dataset["fields.labels"].apply(lambda x: "Defect" in x)].shape[0]
            stats["totalSpikes"]=dataset[dataset["fields.labels"].apply(lambda x: "Spike" in x)].shape[0]
            # extra metrics
            stats["totalOnePointers"]=dataset["fields.customfield_10028"].apply(lambda x: x == 1).sum()
            stats["totalTwoPointers"]=dataset["fields.customfield_10028"].apply(lambda x: x == 2).sum()
            stats["totalThreePointers"]=dataset["fields.customfield_10028"].apply(lambda x: x == 3).sum()
            stats["totalFivePointers"]=dataset["fields.customfield_10028"].apply(lambda x: x == 5).sum()
            # calculated
            stats["storyPointAverage"]=round(stats.get("storyPointSum") / stats.get("totalIssues"), 3)
            stats["noTrackingDeficit"]=round((stats.get("totalNoTrackging") / stats.get("totalIssues")) * 100, 3)
            if isMajorSet: # for annual and quarters
                stats["noStoryPoints"]=dataset["fields.customfield_10028"].apply(lambda x: x is None or x == 0).sum()
                stats["noNameLabel"]=dataset["fields.customfield_10235.value"].apply(lambda x: any(x in n for n in nameLabels)).sum()
    
        return stats
