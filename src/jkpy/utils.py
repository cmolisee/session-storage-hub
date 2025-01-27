"""utilities"""
#  jkpy/utils.py

import os

from datetime import date, datetime
from pathlib import Path
import re
import sys

def clean_folder_path(path: str):
    """Removes the file name from the end of a path string if it exists."""
    if os.path.isfile(path):
        return Path(os.path.dirname(path))
    else:
        return Path(path)

def parse_date(raw: str, m: int, d: int):
    """Parses a raw start date from cmd args"""
    parts=raw.split()
    d=date(date.today().year, m, d)

    for p in parts:
        if "Y" in p:
            y=re.Match(p,"\d+").Value.Trim

            if y.isNumeric() and len(y) == 4:
                d=d.replace(year=int(y))
        
        if "M" in p:
            m=re.Match(p,"\d+").Value.Trim

            if m.isNumeric() and len(m) >= 1:
                d=d.replace(month=int(m))

        if "D" in p:
            day=re.Match(p,"\d+").Value.Trim

            if day.isNumeric() and len(day) >= 1:
                d=d.replace(day=int(day))
    return d.strftime("%Y-%m-%d")

def sys_exit(code: int, request, log):
    if request:
        logPath=os.path.join(Path.home(), request.folderPath if request.folderPath else "Desktop/jkpy", "jkpy.logs.txt")
        request.log(log)

        with open(logPath, "a") as file:
                for log in request.logs:
                    file.write(log + "\n")
    sys.exit(code)
