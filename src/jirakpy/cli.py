"""jirakpy cli"""
# jirakpy/cli.py

import json

import rich.columns
import rich.panel
import rich.table
from . import __app_name__, __version__
import calendar
from jirakpy.config_manager import configManager
from jirakpy.jira_requests import jiraRequest
from jirakpy.layout import make_layout, make_main_panel, make_side_panel, make_table
from jirakpy.types import *
from jirakpy.utils import get_key_given_value, state
from questionary import Choice
from typing_extensions import Annotated
import questionary
import rich
import typer

# TODO:
# refactor to make each step more modular
# create options for running with flags instead of the prompt
# create options for exporting to csv
# alpha sort choice options
# add ability to specify stat labels
# update the deficit to not be negative
# fix layout to show all stats in a single continuout table
# fix layout to not have colored borders
# fix layout to remove panel
# fix layout to conditionally render user choices as console print instead of being formated in a panel with rich
# explore more statistics
    # longest worked ticket, fastest ticket, 
# graphs
    # pie chart ticket types
    # bar chart story point sum

calendar_months = list(calendar.month_name)[1:]
console = rich.console.Console()
appState = state()
config = configManager()
app = typer.Typer(
    name=__app_name__,
    help="An easy way to process Jira data and generate reports",
    add_completion=False,
)

questions = [
    {
        "name": "output_type",
        "question": questionary.select(
            "What kind of report do you want?", 
            [Choice(k,v) for k, v in output_type_dict.items()]
        ),
        "if": lambda x: True,
    },
    {
        "name": "output_statistics",
        "question": questionary.checkbox(
            "Choose which statistics to calculate.", 
            [Choice(k,v) for k, v in kpi_options_dict.items()],
            validate=lambda choices: True if len(choices) > 0 else "Please make a selection.",
        ),
        "if": lambda x: x["output_type"] == 0
    },
    {
        "name": "jira_user",
        "question": questionary.text(
            "Enter your user email associated with jira:",
            validate=lambda x: len(x) > 0
        ),
        "if": lambda x: True if config.get("email") is None else False,
    },
    {
        "name": "jira_api_token",
        "question": questionary.text(
            "Enter you jira api token:",
            validate=lambda x: len(x) > 0
        ),
        "if": lambda x: True if config.get("token") is None else False,
    },
    {
        "name": "dataset_filter",
        "question": questionary.select(
            "Choose how to define the target dataset:",
            [Choice(k,v) for k, v in dataset_target_dict.items()],
        ),
        "if": lambda x: True,
    }, 
    {
        "name": "jira_accountId",
        "question": questionary.text(
            "Enter the accountId of the user:",
            validate=lambda x: len(str(x)) > 0
        ),
        "if": lambda x: x["dataset_filter"] == 1,
    }, 
    {
        "name": "jira_jql",
        "question": questionary.text("Enter the jql for your target dataset:"),
        "if": lambda x: x["dataset_filter"] == 2,
    },
]

def show_version() -> None:
    """Show application name and version"""
    typer.secho(f"🤌 {__app_name__} v{__version__}", fg=typer.colors.MAGENTA)
    raise typer.Exit()
    
def parse_prompt_results(results: dict) -> str:
    """formats the prompt results for the output to the user"""
    SP=" " * 2
    res = ""
    
    for key, value in keyset_dict.items():
        if key not in results:
            continue
        
        v = results[key]
        res += f"{key.upper()}:\n"
        
        if isinstance(v, list):
            res += f"{SP}{f"\n{SP}".join([get_key_given_value(value, i) for i in v])}\n\n"
        elif isinstance(value, dict):
            res += f"{SP}{get_key_given_value(value,v)}\n\n"
        else:
            res += f"{SP}{v}\n\n"
    
    return res

def handle_filter_processing(data):
    console.print("[cyan]Retrieving filters from jira...")
    data = json.loads(data)
    
    console.print("[cyan]Processing request and response...")
    try:
        filters = [Choice(f["name"], f["id"]) for f in data]
        appState.set_item("filters", json.dumps([{ "name": f["name"], "id": f["id"], "url": f["searchUrl"] } for f in data]))
    except Exception as e:
        console.print(f"[red]Error parsing data: {e}")
        exit()
        
    console.print("[cyan]Updating prompt...")
    questions.append(
        {
            "name": "filter_choice",
            "question": questionary.select(
                "Choose the filter for your target dataset:",
                filters,
            ),
            "if": lambda x: x["dataset_filter"] <= 1,
        }
    )
    
    console.print("[green]Processing complete...")

def handle_issue_processing(data): 
    console.print("[cyan]Processing response...")
    data = json.loads(data)
    appState.set_item("data", data)
    
    console.print("[cyan]Processing labels and statistics...")
    stats = {}
    total = data["total"]
    sp_total = sum(issue["fields"]["customfield_10028"] for issue in data["issues"] if issue["fields"]["customfield_10028"] or None is not None)
    nt_total = sum(1 for issue in data["issues"] if issue["fields"]["timespent"] or None is not None)
    stats["total_issues"] = total
    stats["story_point_avg"] = sp_total / total
    stats["no_tracking_sum"] = nt_total
    stats["no_tracking_deficit"] = ((nt_total / total) * 100) - 100
    stats["enhancements"] = sum(1 for issue in data["issues"] if "Enhancement" in issue["fields"]["labels"] or [])
    stats["bugs"] = sum(1 for issue in data["issues"] if "Bug" in issue["fields"]["labels"] or [])
    stats["defects"] = sum(1 for issue in data["issues"] if "Defect" in issue["fields"]["labels"] or [])
    stats["spike"] = sum(1 for issue in data["issues"] if "Spike" in issue["fields"]["labels"] or [])
    
    appState.set_item("stats", { "all": stats })
    
    console.print("[cyan]Building label options...")
    labels = set()
    for issue in data["issues"]:
        for l in issue["fields"]["labels"]:
            labels.add(l) 
        
    appState.set_item("labels", labels)
        
    console.print("[cyan]Updating prompt...")
    questions.append(
        {
            "name": "labels",
            "question": questionary.checkbox(
                "Choose additional labels to run stats on:",
                [Choice(l, l) for l in labels],
            ),
            "if": lambda x: True,
        }
    )
    console.print("[green]Processing complete...")
            
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
        exit()
    
    answers = {}
    jira = jiraRequest()
    for question in questions:
        if not question["if"](answers):
            continue
        
        answers[question["name"]] = question["question"].ask()
        
        if question["name"] == "jira_user":
            config.set("email", answers[question["name"]])
            
        if question["name"] == "jira_api_token":
            config.set("token", answers[question["name"]])
        
        if question["name"] == "dataset_filter" and answers[question["name"]] == 0:
            handle_filter_processing(jira.get_my_filters(config.get("email"), config.get("token")))
        if question["name"] == "jira_accountId":
            handle_filter_processing(
                jira.get_filters_by_accountId(answers[question["name"]], 
                    config.get("email"),
                    config.get("token")
                )
            )
        # if question["name"] == "jira_jql":
        #     # run jql query for issues
        if question["name"] == "filter_choice":
            console.print("[cyan]Evaluating response...")
            filters = json.loads(appState.get_item("filters"))
            f_id = answers[question["name"]]
            for f in filters:
                if f["id"] == f_id:
                    answers[question["name"]] = f"{f["name"]}({f["id"]})"
                    url = f["url"]
            handle_issue_processing(jira.get_issues(url, config.get("email"), config.get("token")))
            
        if question["name"] == "labels":
            data = appState.get_item("data")
            stats = appState.get_item("stats")
            subsets = {l: list() for l in answers[question["name"]]} # instantiate dict with label and empty list pairs
            
            for issue in data["issues"]:
                for label in answers[question["name"]]:
                    if label in issue["fields"]["labels"]:
                        subsets[label].append(issue)
            
            # get stats on each subset
            for k,v in subsets.items():
                res = {}
                total = len(v)
                sp_total = sum(issue["fields"]["customfield_10028"] for issue in v if issue["fields"]["customfield_10028"] or None is not None)
                nt_total = sum(1 for issue in v if issue["fields"]["timespent"] or None is not None)
                res["total_issues"] = total
                res["story_point_avg"] = sp_total / total
                res["no_tracking_sum"] = nt_total
                res["no_tracking_deficit"] = ((nt_total / total) * 100) - 100
                res["enhancements"] = sum(1 for issue in v if "Enhancement" in issue["fields"]["labels"] or [])
                res["bugs"] = sum(1 for issue in v if "Bug" in issue["fields"]["labels"] or [])
                res["defects"] = sum(1 for issue in v if "Defect" in issue["fields"]["labels"] or [])
                res["spike"] = sum(1 for issue in v if "Spike" in issue["fields"]["labels"] or [])
                stats[k] = res
            
            appState.set_item("stats", stats)
    
    content = rich.columns.Columns( [make_table(k,v) for k,v in appState.get_item("stats").items()], )
        
    layout = make_layout()
    layout["body"].update(make_main_panel(f"🐌 {get_key_given_value(output_type_dict, answers["output_type"])}", content))
    layout["side"].update(make_side_panel(parse_prompt_results(answers)))
    
    console.print(layout)

if __name__ == "__main__":
    app()