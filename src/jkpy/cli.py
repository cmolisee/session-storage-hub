"""jkpy cli"""
# jkpy/cli.py

import os
from . import __app_name__, __version__
from datetime import timedelta
from jkpy.config_manager import configManager
from jkpy.jira_requests import jiraRequest
from jkpy.types import *
from jkpy.utils import make_table, state, validate_path, verify_config
from pathlib import Path
from typing_extensions import Annotated
import calendar
import json
import pandas as pd
import rich
import rich.columns
import rich.panel
import rich.table
import typer

console = rich.console.Console()
appState = state()
config = configManager()
jira = jiraRequest()
app = typer.Typer(
    name=__app_name__,
    help="Process Jira data and create reports",
    add_completion=False,
)

def show_version() -> None:
    """Show application name and version"""
    typer.secho(f"🤌 {__app_name__} v{__version__}", fg=typer.colors.MAGENTA)

def handle_request():
    """Make jira request for issues and parse into a data frame"""
    console.print("[cyan]Making request to jira...")
    try:
        res = jira.get_issues_by_jql(appState.get_item("user_jql"), config.get("email"), config.get("token"))
        data = json.loads(res)
        df = pd.json_normalize(data.get("issues"))
        appState.set_item("df", df)
        console.print("[green]Request successful")
    except Exception as e:
        console.print(e)
        exit()

def _get_stats(dataset, name):
    """Process stats on provided dataset"""
    console.print(f"[cyan]Processing data for {name} dataset...")
    dataset={}
    
    try:
        dataset["dataset_name"] = name
        dataset["total_issues"] = dataset.shape[0]
        
        if dataset.shape[0] > 0:
            dataset["story_point_sum"] = dataset["fields.customfield_10028"].sum()
            dataset["total_time_spent"] =  timedelta(seconds=dataset["fields.timespent"].sum())
            dataset["total_no_time_tracking"] = dataset["fields.timespent"].isna().sum()
            dataset["total_enhancements"] = dataset[dataset["fields.labels"].apply(lambda x: "Enhancement" in x)].shape[0]
            dataset["total_bugs"] = dataset[dataset["fields.labels"].apply(lambda x: "Bug" in x)].shape[0]
            dataset["total_defects"] = dataset[dataset["fields.labels"].apply(lambda x: "Defect" in x)].shape[0]
            dataset["total_spikes"] = dataset[dataset["fields.labels"].apply(lambda x: "Spike" in x)].shape[0]
            # calculated
            dataset["story_point_average"] = round(dataset.get("story_point_sum") / dataset.get("total_issues"), 3)
            dataset["no_tracking_deficit"] = round((dataset.get("total_no_time_tracking") / dataset.get("total_issues")) * 100, 3)
    except Exception as e:
        console.print(f"[orange3]Error processing data: {name}")
        exit()
    
    return dataset
    
def process_data():
    """Process issues and user responses to generate statistics"""
    df = appState.get_item("df")
    user_labels = appState.get_item("user_labels") or []
    stats = {}
    
    stats["dataset"] = _get_stats(df, "dataset")
    
    for l in user_labels:
        subset = df[df["fields.labels"].apply(lambda x: l in x)]
        stats[l] = _get_stats(subset, l)
    
    appState.set_item("stats", stats)
    console.print("[green]Processing complete")
    
def show_results() -> None:
    """Create statistics table and print to user"""
    table = make_table(__app_name__, appState.get_item("stats"))
    console.print(table)
    
def export_results(path: Path) -> None:
    """Export results to .xlsx"""
    try:
        p = path.rename(path.with_suffix(".xlsx"))
    
        with pd.ExcelWriter(p) as writer:
            appState.get_item("df").to_excel(writer, sheet_name='data', index=False)
            df2 = pd.DataFrame.from_dict(appState.get_item("stats"), orient="index")
            df2.to_excel(writer, sheet_name='results', index=False)
    except Exception as e:
        console.print(f"[red bold]Error exporting results: {e.message}")
    console.print(f"[green]Results exported to {path}.xlsx")

def set_config(k: str, v: str):
    """set config value"""
    if k not in ("email", "token"):
        raise ValueError("Invalid Key")
    
    if not v:
        raise ValueError("Invalid value")
    
    config.set(k, v)
    
@app.command
def version():
    """print application version"""
    show_version()
    typer.Exit()
        
@app.command
def email(email: str):
    """Set the user email"""
    try:
        set_config("email", email)
    except Exception as e:
        console.print(f"[red bold]Error setting email: {e}")
    typer.Exit()
        
@app.command
def token(token: str):
    """Set the user api token"""
    try:
        set_config("token", token)
    except Exception as e:
        console.print(f"[red bold]Error setting email: {e}")
    typer.Exit()
      
@app.callback(invoke_without_command=True)
def main(
     version: Annotated[
        bool,
        typer.Option(
             "--version",
             "-v",
             help="Show application version.",
             is_eager=True,
         )
     ] = False,
     email: Annotated[
         str,
         typer.Option(
             "--email",
             "-e",
             help="Set user email for making jira requests.",
             is_eager=True,
         )
     ] = None,
     token: Annotated[
         str,
         typer.Option(
             "--token",
             "-t",
             help="Set api token for making jira requests.",
             is_eager=True,
         )
     ] = None,
     jql: Annotated[
         str,
         typer.Option(
             "--jql",
             "-j",
             help="JQL for the dataset.",
         )
     ] = None,
     exportPath: Annotated[
         str,
         typer.Option(
             "--path",
             "-p",
             help="Path to export results",
         )
     ] = None,
     labels: Annotated[
         str,
         typer.Option(
             "--labels",
             "-l",
             help="Labels to identify subsets for additional statistics. Must be comma separated string.",
         )
     ] = None,
     showTable: Annotated[
         bool,
         typer.Option(
             "--show-table",
             help="Display results in terminal",
             is_eager=True,
         )
     ] = False
) -> None:
    """Main application"""
    if version:
        show_version()
        typer.Exit()
        
    if email:
        set_config("email", email)
        
    if token:
        set_config("token", token)
    
    try:
        verify_config(config)
    except Exception as e:
        console.print(e.message)
        typer.Exit()       
    
    console.print(f"[cyan]Starting {__app_name__}...")
    
    if jql:
        appState.set_item("user_jql", jql)
    
    if labels:
        appState.set_item("user_labels", labels.split(","))
    
    handle_request()
    process_data()
    
    if showTable:
        show_results()
    
    if exportPath:
        try:
            path = validate_path(os.path.expanduser(exportPath))
            export_results(path)
        except Exception as e:
            console.print(e.message)
    
if __name__ == "__main__":
    app()