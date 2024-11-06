"""Layout module"""
# jirakpy/layout.py

from rich.table import Table

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