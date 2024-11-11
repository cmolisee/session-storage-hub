"""utilities"""
#  jkpy/utils.py

from datetime import datetime
from rich.table import Table
        
class state():
    def __init__(self):
        self.s = {}
    
    def get_item(self, key: str):
        if key in self.s:
            return self.s[key]
        return None
    
    def set_item(self, key: str, value: any):
        self.s[key] = value
    
def get_key_given_value(dct: dict, v: int) -> str:
    return next((key for key, value in dct.items() if value == v), None)

def verify_config(config):
    r = -3
    if config.get("email"):
        r += 1
    if config.get("token"):
        r += 2
        
    if r == -3:
        return "[red bold]'email' and 'token' are missing..."
    if r == -2:
        return "[red bold]'token' is missing..."
    if r == -1:
        return "[red bold]'email' is missing..."
    
    return None

def split_by_last(string, char):
    last_index = string.rfind(char)
    if last_index == -1:
        return [string]
    return [string[:last_index], string[last_index + 1:]]

def get_timestamp():
    now = datetime.now()
    return f"{now.year}_{now.month}_{now.day}_{now.hour}_{now.minute}"

def make_table(name: str, data: dict) -> Table:
    table = Table(title=name, style="magenta")
    
    table.add_column("Dataset", style="bold", justify="left")
    table.add_column("KPI", style="bold", justify="left")
    table.add_column("Value", justify="right")
    
    for name, obj in data.items():
        for i, (k, v) in enumerate(obj.items()):
            if i == 0:
                table.add_section()
                table.add_row(f"{name}", f"{k}", str(v))
            else:
                table.add_row("", f"{k}", str(v))
        
    return table