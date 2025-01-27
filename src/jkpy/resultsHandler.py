
from datetime import datetime
import os
from pathlib import Path
import pandas as pd
import calendar

from jkpy.jiraHandler import JiraHandler
from jkpy.utils import sys_exit

class ResultsHandler(JiraHandler):
    def handle(self, request):
        request.log("ResultsHandler().handle().")
        if not request.proceed:
            sys_exit(0, request, "request.proceed is False. Exiting.")
        
        try:
            ts=request.timestamp
            datasetPath=os.path.join(Path.home(), request.folderPath, "dataset_" + str(ts) + ".xlsx")
            kpiPath=os.path.join(Path.home(), request.folderPath, str(datetime.now().year) + "_kpis.xlsx")
            logPath=os.path.join(Path.home(), request.folderPath, "jkpy.logs.txt")

            # normalize issues structure for output to file
            df=pd.json_normalize(request.responseData.get("issues"))
            
            request.log(f"outputing dataset to {datasetPath}")
            with pd.ExcelWriter(datasetPath) as writer:
                df.to_excel(writer, sheet_name='data', index=True)

            request.log(f"outputing kpi's to {kpiPath}")
            with pd.ExcelWriter(kpiPath) as writer:
                df.to_excel(writer, sheet_name='data', index=False)

                for month in range(1, 12+1):
                    monthName=calendar.month_name[month]
                    df2=pd.DataFrame.from_dict(request.metrics.get(monthName), orient="index")
                    df2.to_excel(writer, sheet_name=monthName, index=False)

                df3=pd.DataFrame.from_dict(request.metrics.get("annual"), orient="index")
                df3.to_excel(writer, sheet_name="annual", index=True)

            with open(logPath, "a") as file:
                for log in request.logs:
                    file.write(log + "\n")
    
        except Exception as e:
            sys_exit(1, request, f"exception occured outputing results: {e}")

        return super().handle(request)