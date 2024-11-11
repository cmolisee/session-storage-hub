"""jkpy cli"""
# jkpy/cli.py

from . import __app_name__, __version__
from datetime import timedelta
from jkpy.config_manager import configManager
from jkpy.jira_requests import jiraRequest
from jkpy.types import *
from jkpy.utils import make_table, state, verify_config
from pathlib import Path
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

calendar_months = list(calendar.month_name)[1:]
console = rich.console.Console()
appState = state()
config = configManager()
jira = jiraRequest()
app = typer.Typer(
    name=__app_name__,
    help="An easy way to process Jira data and generate reports",
    add_completion=False,
)

questions = [
    # bring this back later if necessary
    # {
    #     "name": "output_type",
    #     "question": questionary.select(
    #         "What kind of report do you want?", 
    #         [Choice(k,v) for k, v in type_output.items()]
    #     ),
    #     "if": lambda x: True,
    # },
    {
        "name": "opt_export",
        "question": questionary.text("Path to export results (leave blank to decline export):"),
        "if": lambda x: True,
    },
    {
        "name": "email",
        "question": questionary.text(
            "Enter your user email associated with jira:",
            validate=lambda x: len(x) > 0
        ),
        "if": lambda x: True if config.get("email") is None else False,
    },
    {
        "name": "token",
        "question": questionary.text(
            "Enter you jira api token:",
            validate=lambda x: len(x) > 0
        ),
        "if": lambda x: True if config.get("token") is None else False,
    },
    {
        "name": "request_type",
        "question": questionary.select(
            "Choose how to request the data:",
            [Choice(k,v) for k, v in type_request.items()],
        ),
        "if": lambda x: True,
    },
    {
        "name": "jql",
        "question": questionary.text("Enter the jql for your target dataset:"),
        "if": lambda x: x.get("request_type") == 1,
    },
]

def show_version() -> None:
    """Show application name and version"""
    typer.secho(f"🤌 {__app_name__} v{__version__}", fg=typer.colors.MAGENTA)

def get_user_filters():
    """Get user filters and process"""
    console.print("[cyan]Retrieving filters from jira...")
    filter_results = jira.get_my_filters(config.get("email"), config.get("token")) or {}
    filter_data = json.loads(filter_results)
    
    console.print("[cyan]Processing request and response...")
    filters = sorted([Choice(f"{f.get("name")}({f.get("id")})", f.get("jql")) for f in filter_data], key=lambda x: x.title)
    appState.set_item("filters", json.dumps([{ "name": f"{f.get("name")}({f.get("id")})", "jql": f.get("jql") } for f in filter_data]))
        
    console.print("[cyan]Updating prompt options...")
    questions.append(
        {
            "name": "filter_choice",
            "question": questionary.select(
                "Choose the filter for your target dataset:",
                filters,
            ),
            "if": lambda x: x.get("request_type") <= 1,
        }
    )
    
    console.print("[green]Processing complete...")

def handle_request():
    """Requests issues, converts to data frame, and updates app state"""
    console.print("[cyan]Request data...")
    res = jira.get_issues_by_jql(appState.get_item("raw_jql"), config.get("email"), config.get("token"))
    data = json.loads(res)
    df = pd.json_normalize(data.get("issues"))
    appState.set_item("df", df)
                        
def handle_label_processing():
    """Process issues to retrieve labels and update prompt"""
    console.print("[cyan]Building label options...")
    df = appState.get_item("df")
    labels = set()
    for l in df.get("fields.labels") or []:
        labels.update(l)
    labels = sorted(labels)
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
        
def handle_statistic_processing():
    """Process issues and user responses to generate statistics"""
    df = appState.get_item("df")
    selected_labels = appState.get_item("selected_labels") or []
    stats = {}
    
    console.print("[cyan]Processing data sets...")
    dataset = {}
    dataset["label"] = "(all labels)"
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
        dataset["story_point_average"] = round(dataset.get("story_point_sum") / dataset.get("total_issues"), 3)
        dataset["no_tracking_deficit"] = round((dataset.get("total_no_time_tracking") / dataset.get("total_issues")) * 100, 3)
    stats["full dataset"] = dataset
    
    for l in selected_labels:
        tmp = {}
        sub = df[df["fields.labels"].apply(lambda x: l in x)]
        tmp["label"] = l
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
            tmp["story_point_average"] = round(tmp.get("story_point_sum") / tmp.get("total_issues"), 3)
            tmp["no_tracking_deficit"] = round((tmp.get("total_no_time_tracking") / tmp.get("total_issues")) * 100, 3)
        stats[l] = tmp
    
    appState.set_item("stats", stats)
    console.print("[green]Processing complete...")
    
def show_prompt() -> None:
    """Prompt question loop and flow control"""
    answers = {}
    for question in questions:
        if not question.get("if")(answers):
            continue
        
        answers[question.get("name")] = question.get("question").ask()
        
        if question.get("name") == "email":
            config.set("email", answers.get("email"))
            
        if question.get("name") == "token":
            config.set("token", answers.get("token"))
        
        # if we chose jql for request_type then respond to results of jql prompt
        if question.get("name") == "jql":
            appState.set_item("raw_jql", answers.get("jql"))
            handle_request()
            handle_label_processing()
        
        # if we chose filters for request_type then request filters to generate prompt
        if question.get("name") == "request_type" and answers.get("request_type") == 0:
            get_user_filters()
        
        # continue prompt options from filter request_type
        if question.get("name") == "filter_choice":
            appState.set_item("raw_jql", answers.get("filter_choice"))
            handle_request()
            handle_label_processing()
        
        # process data after labels have been selected
        if question.get("name") == "labels":
            appState.set_item("selected_labels", answers.get("labels"))
            handle_statistic_processing()
    
    appState.set_item("answers", answers)
    
def show_results() -> None:
    """Create statistics table and print to user"""
    table = make_table("KPI Statistics", appState.get_item("stats"))
    console.print(table)

def export_results(path: str) -> None:
    """Export results to .xlsx"""
    if not path:
        return
    
    if "." in path:
        path = path[:path.index(".")]
    
    if path.endswith("/"):
        path.strip("/")
        path += "/jirakpy"
    
    with pd.ExcelWriter(Path.home() / (path + ".xlsx")) as writer:
        appState.get_item("df").to_excel(writer, sheet_name='data', index=False)
        df2 = pd.DataFrame.from_dict(appState.get_item("stats"), orient="index")
        df2.to_excel(writer, sheet_name='results', index=False)
    
    console.print(f"[green] Results exported to {Path.home() / (path + ".xlsx")}")

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
     prompt: Annotated[
         bool,
         typer.Option(
             "--prompt",
             "-P",
             help="Run with prompt.",
             is_eager=True,
         )
     ] = False,
     verifyConfig: Annotated[
         bool,
         typer.Option(
             "--verify",
             "-V",
             help="Verify the user email and token exists.",
             is_eager=True,
         )
     ] = False,
     email: Annotated[
         str,
         typer.Option(
             "--email",
             help="User email to make jira requests. Will override existing value. Can ommit if already exists and is valid.",
             is_eager=True,
         )
     ] = config.get("email"),
     token: Annotated[
         str,
         typer.Option(
             "--token",
             help="API token to make jira requests. Will override existing value. Can ommit if already exists and is valid.",
             is_eager=True,
         )
     ] = config.get("token"),
     jql: Annotated[
         str,
         typer.Option(
             "--jql",
             help="JQL for the dataset.",
             is_eager=True,
         )
     ] = "",
     export: Annotated[
         str,
         typer.Option(
             "--export-path",
             help="Path to export results relative to your home path (~/path/file). Do not add a file extension. Anything after a period character will be removed. If no file name is provided (i.e. the provided path ends with a slash) then the default 'jkpy_results' will be used.",
             is_eager=True,
         )
     ] = "",
     labels: Annotated[
         str,
         typer.Option(
             "--labels",
             help="Comma separated list of labels to define subsets of the main dataset. No spaces (i.e. a,b,c,d)",
             is_eager=True,
         )
     ] = "",
     showTable: Annotated[
         bool,
         typer.Option(
             "--show-table",
             help="Will display results in a formatted table in the terminal.",
             is_eager=True,
         )
     ] = False
) -> None:
    """Main application"""
    if version:
        show_version()
        exit()
        
    if email:
        config.set("email", email)
        
    if token:
        config.set("token", token)
    
    if verifyConfig:
        r = verify_config(config)
        if r == -3:
            console.print("[red bold]'email' and 'token' are missing...")
        if r == -2:
            console.print("[red bold] 'token' is missing...")
        if r == -1:
            console.print("[red bold] 'email' is missing...")
        if r == 0:
            console.print("[green] 'email' and 'token' exist!")
        exit()
    
    if prompt:
        show_prompt()
        show_results()
        
        ans = appState.get_item("answers") or {}
        path = ans.get("opt_export")
        if path:
            export_results(path)
        
        
    if not prompt: 
        console.print(f"[cyan] Initializing {__app_name__}...")
        if verify_config() < 0:
            console.print("[red bold] Must provide 'email' or 'token'.\n\t- Use --verify to check which is missing.\n\t- Use --email to set your email. \n\t- Use --token to set your token.")
            exit()
        
        if jql:
            console.print("[cyan] Parsing JQL...")
            appState.set_item("raw_jql", jql)
        else:
            console.print("[red bold] Must provide a filter a jql string.\n\t- Use --jql to provide jql string.")
            exit()
        
        if labels:
            console.print("[cyan] Parsing Labels...")
            appState.set_item("selected_labels", labels.split(","))
        
        handle_request()
        handle_statistic_processing()
    
        if showTable:
            show_results()
            
        path = export
        if not path:
            console.print("[red bold] No export path was provided...")
        else:
            export_results(path)
    
if __name__ == "__main__":
    app()