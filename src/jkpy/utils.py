"""utilities"""
#  jkpy/utils.py

from datetime import datetime
from pathlib import Path
from rich.table import Table
        
class state():
    def __init__(self):
        """Initialize object"""
        self.s = {}
    
    def get(self, key: str):
        """Get value by key"""
        if key in self.s:
            return self.s[key]
        return None
    
    def set(self, key: str, value: any):
        self.s[key] = value

def get_timestamp():
    now = datetime.now()
    return f"{now.year}_{now.month}_{now.day}:{now.hour}:{now.minute}"

def verify_config(config):
    """validate config contains required values"""
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

def validate_path(path):
    """validate path"""
    p = Path(path.split('.', 1)[0] + ".xlsx")

    if not p.parent.is_dir():
        raise ValueError(f"Parent directory does not exist: {p.parent}")
    return p

def make_table(name: str, data: dict) -> Table:
    """build table to display stats to user"""
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