"""Layout module"""
# jirakpy/layout.py

from rich import box
from rich.layout import Layout
from rich.table import Table
from rich.panel import Panel
from rich.align import Align
from rich.console import Group


def make_layout() -> Layout:
    """Define the Layout with header, 30/70 body"""
    layout = Layout(name="root")

    layout.split(
        Layout(name="header", size=3),
        Layout(name="main", ratio=1),
    )
    layout["main"].split_row(
        Layout(name="side"),
        Layout(name="body", ratio=2, minimum_size=60),
    )
    return layout
    
def make_side_panel(content: any) -> Panel:
    """Side panel."""
    side = Table.grid(padding=1)
    side.add_column(style="magenta", justify="left")
    side.add_row(content)

    side_panel = Panel(
        side,
        box=box.ROUNDED,
        padding=(1, 2),
        title="Details",
        border_style="bright_blue",
    )
    return side_panel

def make_main_panel(title: str, content: any) -> Panel:
    """Main panel."""
    main = Table.grid(padding=1)
    main.add_column(style="magenta", justify="center")
    main.add_row(content)
    
    main_panel = Panel(
        Align.center(
            Group("\n", Align.center(main)),
            vertical="middle",
        ),
        box=box.ROUNDED,
        padding=(1, 2),
        title=title,
        border_style="bright_blue",
    )
    return main_panel