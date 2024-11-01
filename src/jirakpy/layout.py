"""Layout module"""
# jirakpy/layout.py

from rich import box
from rich.layout import Layout
from rich.table import Table
from rich.panel import Panel


def make_layout() -> Layout:
    """Define the Layout."""
    layout = Layout(name="root")

    layout.split(
        Layout(name="main"),
    )
    layout["main"].split_row(
        Layout(name="side", ratio=4),
        Layout(name="body", ratio=6),
    )
    return layout
    
def make_side_panel(content: any) -> Panel:
    """Side panel."""
    return Panel(
        content,
        box=box.ROUNDED,
        padding=(1),
        title="Details",
        border_style="bright_blue",
    )

def make_main_panel(title: str, content: any) -> Panel:
    """Main panel."""
    return Panel(
        content,
        box=box.ROUNDED,
        padding=(2),
        title=title,
        border_style="bright_blue",
    )

def make_table(name: str, data: dict) -> Table:
    table = Table(title=name, style="magenta")
    
    table.add_column("KPI", style="bold", justify="left")
    table.add_column("Value", justify="right")
    
    for k,v in data.items():
        table.add_row(f"{k}", f"{v}")
        
    return table