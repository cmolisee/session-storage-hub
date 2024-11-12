"""utilities"""
#  jkpy/utils.py

from datetime import datetime
from pathlib import Path
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
    e = config.get("email")
    t = config.get("token")
    
    if not e and not t:
        raise Exception("[red bold]Missing 'email' and 'token'")
    elif not e:
        raise Exception("[red bold]Missing 'email'")
    elif not t:
        raise Exception("[red bold]Missing 'token'")
    else:
        return True

def split_by_last(string, char):
    last_index = string.rfind(char)
    if last_index == -1:
        return [string]
    return [string[:last_index], string[last_index + 1:]]

def get_timestamp():
    now = datetime.now()
    return f"{now.year}_{now.month}_{now.day}_{now.hour}_{now.minute}"

def validate_path(path):
    """validate path"""
    p = Path(path)

    if not path.parent.is_dir():
        raise ValueError(f"Parent directory does not exist: {path.parent}")
    return p

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