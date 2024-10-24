"""jirakpy cli"""
# jirakpy/cli.py

import calendar
from typing import Union
import typer
import questionary

from questionary import Choice
from typing_extensions import Annotated
from rich.console import Console
from jirakpy.layout import *
from . import __app_name__, __version__

console = Console()
app = typer.Typer(
    name=__app_name__,
    help="An easy way to process Jira csv export files for KPI's",
    add_completion=False,
)

type_dict = {
    "KPI Statistics": 0,
    "Graph": 1,
}

stat_dict = {
    "ticket total": 1,
    "total story points": 2,
    "avg story points": 3,
    "avg story points by sprint": 4,
    "avg story points by month": 5,
    "enhancments": 6,
    "bugs": 7,
    "defects": 8,
    "spikes": 9,
    "tickets w/o tracking": 10,
    "time tracking deficit": 11,
}

graph_dict = {
    "pie chart (ticket type)": 1,
    "bar chart (ticket status)": 2,
}

calendar_months = list(calendar.month_name)[1:]

# how to style with typer or rich...
questions = [
    {
        "type": "select",
        "name": "type",
        "message": "What kind of report do you want?",
        "choices": [Choice(k,v) for k, v in type_dict.items()],
    },
    {
        "type": "checkbox",
        "message": "(optional) Choose person(s) to filter the report on.",
        "name": "persons",
        # populate this from the options available from the report
        "choices": [
            Choice("person a"),
            Choice("person b"),
            Choice("person c"),
        ],
    },
    {
        "type": "checkbox",
        "message": "(optional) Choose year(s) to filter the report on.",
        "name": "years",
        # populate this from the options available from the report
        # add none to the options
        # if only 1 year is available then don't show this message
        "choices": [
            Choice("2023"),
            Choice("2024"),
        ],
    },
    {
        "type": "checkbox",
        "message": "(optional) Choose month(s) to filter the report on.",
        "name": "months",
        # adjust this list based on valid dates provided by the csv
        # add "none" to the options
        # if only 1 month is available then don't show this message
        "choices": list(map(lambda x: Choice(x), calendar_months)),
    },
    {
        "type": "checkbox",
        "message": "(optional) Choose sprint(s) to filter the report on.",
        "name": "sprints",

        # populate from csv
        # if only 1 sprint is available then don't show this message
        "choices": [
            Choice("DPM Web Eng 24.19"),
            Choice("DPM Web Eng 24.20"),
            Choice("DPM Web Eng 24.21"),
            Choice("DPM Web Eng 24.22"),
        ],
    },
    {
        "type": "checkbox",
        "message": "Choose which KPI statistics you want to calculate.",
        "name": "stats",
        "when": lambda x: x["type"] == 0,
        "validate": lambda choices: True if len(choices) > 0 else "Please choose at least 1 stat",
        "choices": [Choice(k,v) for k, v in stat_dict.items()],
    },
    {
        "type": "select",
        "message": "Choose which graph you want to calculate.",
        "name": "graph",
        "when": lambda x: x["type"] == 1,
        "choices": [Choice(k,v) for k, v in graph_dict.items()],
    }
]

def get_key_given_value(dct: dict, v: int) -> str:
    return next((key for key, value in dct.items() if value == v), None)

def show_version() -> None:
    """Show application name and version"""
    typer.secho(f"🤌 {__app_name__} v{__version__}", fg=typer.colors.MAGENTA)
    raise typer.Exit()

def make_details(answers: dict) -> str:
    TAB = " " * 4
    
    return f"""Selected Type:
{TAB}{get_key_given_value(type_dict, answers["type"])}

Statistics:
{"\n".join(f"{TAB}{item}" for item in list(map(lambda x: get_key_given_value(stat_dict, x), answers["stats"])))}

Filtered By:
    Persons: 
{"\n".join(f"{TAB}{TAB}{item}" for item in answers["persons"]) if len(answers["persons"]) > 0 else f"{TAB}{TAB}None"}
    Years:
{"\n".join(f"{TAB}{TAB}{item}" for item in answers["years"]) if len(answers["years"]) > 0 else f"{TAB}{TAB}None"}
    Months: 
{"\n".join(f"{TAB}{TAB}{item}" for item in answers["months"]) if len(answers["months"]) > 0 else f"{TAB}{TAB}None"}    
    Sprints: 
{"\n".join(f"{TAB}{TAB}{item}" for item in answers["sprints"]) if len(answers["sprints"]) > 0 else f"{TAB}{TAB}None"}
    """

@app.callback(invoke_without_command=True)
def main(
     version: Annotated[
         bool,
         typer.Option(
             "--version",
             "-v",
             help="Show version and exit.",
             is_eager=True,
         )
     ] = False,
) -> None:
    """Main application function"""
    if version:
        show_version()
        
    user_input = questionary.prompt(questions)
    
    layout = make_layout()
    layout["body"].update(make_main_panel("🐌 MaIn CoNtEnT\n", "render content here..."))
    layout["side"].update(make_side_panel(make_details(user_input)))
    
    console.print(layout)

if __name__ == "__main__":
    app()