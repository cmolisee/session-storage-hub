"""jirakpy cli"""
# jirakpy/cli.py

from . import __app_name__, __version__
from datetime import timedelta
from jirakpy.config_manager import configManager
from jirakpy.jira_requests import jiraRequest
from jirakpy.layout import make_table
from jirakpy.types import *
from jirakpy.utils import get_key_given_value, state
from questionary import Choice
from typing_extensions import Annotated
import calendar
import json
import pandas as pd
import questionary
import rich
import rich.columns
import rich.panel
import rich.table
import typer

# TODO:
# refactor to make each step more modular
# create options for running with flags instead of the prompt
# create options for exporting to csv
# alpha sort choice options
# add ability to specify stat labels
# update the deficit to not be negative
# fix layout to show all stats in a single continuous table
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
            "Choose a dataset:",
            [Choice(k,v) for k, v in dataset_target_dict.items()],
        ),
        "if": lambda x: True,
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

def handle_filter_processing(filter_results):
    """
        Process jira request data for filters.
        Retrieve name, id, and searchUrl and store in app state.
        Create prompt to present filters to user.
    """
    console.print("[cyan]Retrieving filters from jira...")
    filter_data = json.loads(filter_results)
    
    console.print("[cyan]Processing request and response...")
    try:
        filters = [Choice(f["name"], f["id"]) for f in filter_data]
        appState.set_item("filters", json.dumps([{ "name": f["name"], "id": f["id"], "url": f["searchUrl"] } for f in filter_data]))
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

def handle_filter_choice(question, answers):
    """Process user filter choice to return searchUrl for request"""
    console.print("[cyan]Evaluating response...")
    filters = json.loads(appState.get_item("filters"))
    f_id = answers[question["name"]]
    for f in filters:
        if f["id"] == f_id:
            answers[question["name"]] = f"{f["name"]}({f["id"]})"
            return f["url"]
    return None
                    
def handle_label_processing(issue_results):
    """
        Process jira request data for labels.
        Retrieve all unique label names and store in app state.
        Create prompt to present labels to user.
    """
    console.print("[cyan]Processing response...")
    data = json.loads(issue_results)
    df = pd.json_normalize(data["issues"])
    
    appState.set_item("df", df)
    
    console.print("[cyan]Building label options...")
    labels = set()
    for l in df["fields.labels"]:
        labels.update(l)
    
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
        
def handle_statistic_processing(selected_labels: list):
    df = appState.get_item("df")
    stats = {}
    
    console.print("[cyan]Processing data sets...")
    dataset = {}
    dataset["total_issues"] = df.shape[0]
    if df.shape[0] > 0:
        dataset["story_point_sum"] = df["fields.customfield_10028"].sum()
        dataset["total_time_spent"] =  timedelta(seconds=df["fields.timespent"].sum())
        dataset["total_no_time_tracking"] = df["fields.timespent"].isna().sum()
        dataset["total_enhancements"] = df[df["fields.labels"].apply(lambda x: "Enhancement" in x)].shape[0]
        dataset["total_bugs"] = df[df["fields.labels"].apply(lambda x: "Bug" in x)].shape[0]
        dataset["total_defects"] = df[df["fields.labels"].apply(lambda x: "Defect" in x)].shape[0]
        dataset["total_spikes"] = df[df["fields.labels"].apply(lambda x: "Spike" in x)].shape[0]
        # calculated
        dataset["story_point_average"] = round(dataset["story_point_sum"] / dataset["total_issues"], 3)
        dataset["no_tracking_deficit"] = round((dataset["total_no_time_tracking"] / dataset["total_issues"]) * 100, 3)
    stats["dataset"] = dataset
    
    for l in selected_labels:
        tmp = {}
        sub = df[df["fields.labels"].apply(lambda x: l in x)]
        tmp["total_issues"] = sub.shape[0]
        if sub.shape[0] > 0:
            tmp["story_point_sum"] = sub["fields.customfield_10028"].sum()
            tmp["total_time_spent"] = timedelta(seconds=sub["fields.timespent"].sum())
            tmp["total_no_time_tracking"] = sub["fields.timespent"].isna().sum()
            tmp["total_enhancements"] = sub[sub["fields.labels"].apply(lambda x: "Enhancement" in x)].shape[0]
            tmp["total_bugs"] = sub[sub["fields.labels"].apply(lambda x: "Bug" in x)].shape[0]
            tmp["total_defects"] = sub[sub["fields.labels"].apply(lambda x: "Defect" in x)].shape[0]
            tmp["total_spikes"] = sub[sub["fields.labels"].apply(lambda x: "Spike" in x)].shape[0]
            # calculated
            tmp["story_point_average"] = round(tmp["story_point_sum"] / tmp["total_issues"], 3)
            tmp["no_tracking_deficit"] = round((tmp["total_no_time_tracking"] / tmp["total_issues"]) * 100, 3)
        stats[l] = tmp
    
    appState.set_item("stats", stats)
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
            
        if question["name"] == "jira_jql":
            handle_label_processing(jira.get_issues_by_jql(answers[question["name"]], config.get("email"), config.get("token")))
        
        if question["name"] == "filter_choice":
            url = handle_filter_choice(question, answers)
            handle_label_processing(jira.get_issues(url, config.get("email"), config.get("token")))
            
        if question["name"] == "labels":
            handle_statistic_processing(answers[question["name"]])

    # finally, for prompt version
    table = make_table(get_key_given_value(output_type_dict, answers["output_type"]), appState.get_item("stats"))
    console.print(table)

if __name__ == "__main__":
    app()