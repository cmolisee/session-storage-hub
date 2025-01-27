"""jkpy cli"""
# jkpy/cli.py

from jkpy.buildMetricsHandler import BuildMetricsHandler
from jkpy.buildRequestHandler import BuildRequestHandler
from jkpy.configHandler import ConfigHandler
from jkpy.httpRequestHandler import HttpRequestHandler
from jkpy.jiraRequest import JiraRequest
from jkpy.resultsHandler import ResultsHandler
from . import __app_name__
from typing_extensions import Annotated
import typer

app=typer.Typer(
    name=__app_name__,
    help="Process Jira data and create reports",
    add_completion=False,
)

@app.callback(invoke_without_command=True)
def main(
    email: Annotated[
        str,
        typer.Option(
            "--email",
            "-e",
            help="Set user email for making jira requests.",
            is_eager=True,
        )
    ]=None,
    token: Annotated[
        str,
        typer.Option(
            "--token",
            "-t",
            help="Set api token for making jira requests.",
            is_eager=True,
        )
    ]=None,
    isSetup: Annotated[
        bool,
        typer.Option(
            "--isSetup",
            help="Specifies if the request is for setup only.",
            is_eager=True,
        )
    ]=False,
    folderPath: Annotated[
        str,
        typer.Option(
            "--folderPath",
            "-fp",
            help="A Path string specifying the primary folder path to export all generated files.",
            is_eager=True,
        )
    ]=None,
    teamLabels: Annotated[
        str,
        typer.Option(
            "--teamLabels",
            "-tl",
            help="A Comma separated string specifying team labels used in the default query for filtering results by team. If specified, the config file will be updated with any new labels - else, the config file values are used.",
            is_eager=True,
        )
    ]=None,
    nameLabels: Annotated[
        str,
        typer.Option(
            "--nameLabels",
            "-nl",
            help="A Comma separated string specifying name labels used in the default query for filtering results by user name. If specified, the config file will be updated with any new labels - else, the config file values are used.",
            is_eager=True,
        )
    ]=None,
    statusTypes: Annotated[
        str,
        typer.Option(
            "--statusTypes",
            "-st",
            help="A Comma separated string specifying ticket status types to be used in the default query in the CHANGED TO argument. If specified, the config file will be updated with any new status types - else, the config file values are used.",
            is_eager=True,
        )
    ]=None,
    remove_statusTypes: Annotated[
        str,
        typer.Option(
            "--remove-statusTypes",
            help="A Comma separated string specifying status types to remove from the config.",
            is_eager=True,
        )
    ]=None,
    remove_teamLabels: Annotated[
        str,
        typer.Option(
            "--remove-teamLabels",
            help="A Comma separated string specifying team labels to remove from the config. This will not remove any data from the <current_year>_kpis.xlsx file.",
            is_eager=True,
        )
    ]=None,
    remove_nameLabels: Annotated[
        str,
        typer.Option(
            "--remove-nameLabels",
            help="A Comma separated string specifying name labels to remove from the config. This will not remove any data from the <current_year>_kpis.xlsx file.",
            is_eager=True,
        )
    ]=None,
    startDate: Annotated[
        str,
        typer.Option(
            "--startDate",
            help="A date string specifying the start date to be used for the default query.'<1-12>M <1-31>D <xxxx>Y' where M is for month, D is for day, Y is for year. If unspecified the default will be the start of the current year.",
            is_eager=True,
        )
    ]=None,
    endDate: Annotated[
        str,
        typer.Option(
            "--endDate",
            help="A date string specifying the end date to be used for the default query. '<1-12>M <1-31>D <xxxx>Y' where M is for month, D is for day, Y is for year. If unspecified the default will be the end of the current year.",
            is_eager=True,
        )
    ]=None,
    showConfig: Annotated[
        bool,
        typer.Option(
            "--showConfig",
            help="If true will print the config values to console.",
            is_eager=True,
        )
    ]=False,
) -> None:
    """Main application"""
    request=JiraRequest({
        "isSetup": isSetup,
        "email": email,
        "token": token,
        "folderPath": folderPath,
        "teamLabels": teamLabels,
        "nameLabels": nameLabels,
        "statusTypes": statusTypes,
        "remove_teamLabels": remove_teamLabels,
        "remove_nameLabels": remove_nameLabels,
        "remove_statusTypes": remove_statusTypes,
        "startDate": startDate,
        "endDate": endDate,
        "showConfig": showConfig
    });

    request.log("request has been initialized.")

    resultsHandler=ResultsHandler()
    buildMetricsHandler=BuildMetricsHandler(resultsHandler)
    httpRequestHandler=HttpRequestHandler(buildMetricsHandler)
    buildRequestHandler=BuildRequestHandler(httpRequestHandler)
    configHandler=ConfigHandler(buildRequestHandler)

    configHandler.handle(request)

    print("CoMpLeTe!")
    
if __name__ == "__main__":
    app()