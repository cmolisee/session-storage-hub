"""jkpy cli"""
# jkpy/cli.py

from . import __app_name__, __version__
from datetime import timedelta
from jkpy.config_manager import configManager
from jkpy.jira_requests import jiraRequest
from jkpy.utils import get_timestamp, make_table, state, validate_path, verify_config
from pathlib import Path
from typing_extensions import Annotated
import os
import pandas as pd
import rich
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
    _debug(28, __name__, "printing version")
    typer.secho(f"🤌 {__app_name__} v{__version__}", fg=typer.colors.MAGENTA)

def _debug(ln, func, *args):
    if appState.get("debug"):
        for arg in args: 
            console.print(f"[medium_orchid] {get_timestamp()} ::: {func}:{ln}")
            console.print(f"\t[medium_orchid] {arg}")

def handle_request():
    """Make jira request for issues and parse into a data frame"""
    console.print("[cyan]Making request to jira...")
    try:
        issues = jira.request(appState.get("user_jql"), config.get("email"), config.get("token"))
        _debug(42, __name__, f"user_jql: {appState.get("user_jql")}", f"total issues: {len(issues)}")
        df = pd.json_normalize(issues)
        appState.set("df", df)
        console.print("[green]Request successful")
    except Exception as e:
        _debug(47, __name__, e)
        console.print(f"{e}")
        exit()

def _get_stats(dataset: pd.DataFrame, name):
    """Process stats on provided dataset"""
    console.print(f"[cyan]Processing data for '{name}'...")
    _debug(54, __name__, f"name: {name}")
    stats={}
    
    try:
        stats["dataset_name"] = name
        stats["total_issues"] = dataset.shape[0]
        
        if dataset.shape[0] > 0:
            stats["story_point_sum"] = dataset["fields.customfield_10028"].sum()
            stats["total_time_spent"] =  timedelta(seconds=dataset["fields.timespent"].sum())
            stats["total_no_time_tracking"] = dataset["fields.timespent"].isna().sum()
            stats["total_enhancements"] = dataset[dataset["fields.labels"].apply(lambda x: "Enhancement" in x)].shape[0]
            stats["total_bugs"] = dataset[dataset["fields.labels"].apply(lambda x: "Bug" in x)].shape[0]
            stats["total_defects"] = dataset[dataset["fields.labels"].apply(lambda x: "Defect" in x)].shape[0]
            stats["total_spikes"] = dataset[dataset["fields.labels"].apply(lambda x: "Spike" in x)].shape[0]
            # calculated
            stats["story_point_average"] = round(stats.get("story_point_sum") / stats.get("total_issues"), 3)
            stats["no_tracking_deficit"] = round((stats.get("total_no_time_tracking") / stats.get("total_issues")) * 100, 3)
    except Exception as e:
        _debug(73, __name__, e)
        console.print(f"[orange3]Error processing '{name}'...")
        console.print(e)
        exit()
    
    return stats
    
def process_data():
    """Process issues and user responses to generate statistics"""
    df = appState.get("df")
    user_labels = appState.get("user_labels") or []
    stats = {}
    
    stats["dataset"] = _get_stats(df, "dataset")
    
    for l in user_labels:
        subset = df[df["fields.labels"].apply(lambda x: l in x)]
        stats[l] = _get_stats(subset, l)
    
    appState.set("stats", stats)
    _debug(93, __name__, f"Processed datasets:", ", ".join(stats.keys()))
    console.print("[green]Processing complete")
    
def show_results() -> None:
    """Create statistics table and print to user"""
    table = make_table(__app_name__, appState.get("stats"))
    console.print(table)
    
def export_results(path: Path) -> None:
    """Export results to .xlsx"""
    _debug(103, __name__, f"Path: {path}")
    try:
        with pd.ExcelWriter(path) as writer:
            appState.get("df").to_excel(writer, sheet_name='data', index=False)
            df2 = pd.DataFrame.from_dict(appState.get("stats"), orient="index")
            df2.to_excel(writer, sheet_name='results', index=False)
    except Exception as e:
        _debug(113, __name__, e)
        console.print(f"[red bold]Error exporting results: {e}")
    console.print(f"[green]Results exported to {path}")

def set_config(k: str, v: str):
    """set config value"""
    _debug(119, __name__, f"Setting {k}: {v}")
    if k not in ("email", "token"):
        raise ValueError("Invalid Key")
    
    if not v:
        raise ValueError("Invalid value")
    
    config.set(k, v)

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
             is_eager=True,
         )
     ] = None,
     exportPath: Annotated[
         str,
         typer.Option(
             "--path",
             "-p",
             help="Path to export results",
             is_eager=True,
         )
     ] = None,
     labels: Annotated[
         str,
         typer.Option(
             "--labels",
             "-l",
             help="Labels to identify subsets for additional statistics. Must be comma separated string.",
             is_eager=True,
         )
     ] = None,
     showTable: Annotated[
         bool,
         typer.Option(
             "--show-table",
             "-s",
             help="Display results in terminal",
             is_eager=True,
         )
     ] = False,
     debug: Annotated[
         bool,
         typer.Option(
             "--debug",
             "-d",
             help="Enable debugging",
             is_eager=True,
         )
     ] = False
) -> None:
    """Main application"""
    if version:
        show_version()
        exit()

    if debug:
        appState.set("debug", True)
        _debug(205, __name__, "Enabling Debug Mode")
        
    if email:
        set_config("email", email)
        
    if token:
        set_config("token", token)
    
    try:
        verify_config(config)
    except Exception as e:
        _debug(216, __name__, e)
        console.print(f"{e}")
        exit()       
    
    console.print(f"[cyan]Starting {__app_name__}...")
    
    if jql:
        _debug(223, __name__, f"user_jql: {jql}")
        appState.set("user_jql", jql)
    else:
        console.print("[orange3]No JQL specified. Exiting...")
        exit()

    if labels:
        _debug(230, __name__, f"user_labels: {labels}")
        appState.set("user_labels", labels.split(","))
    
    handle_request()
    process_data()
    
    if showTable:
        show_results()
    
    if exportPath:
        try:
            path = validate_path(os.path.expanduser(exportPath))
            export_results(path)
        except Exception as e:
            console.print(f"{e}")
    
if __name__ == "__main__":
    app()