"""jirapy CLI"""
# jirapy/cli.py

from datetime import datetime
import typer
from typing import Optional
from typing_extensions import Annotated
from . import __app_name__, __version__

class CliState:
    def __init__(self):
        self.verbose: bool = False
        
state = CliState()
app = typer.Typer(
    name=__app_name__,
    help="this is an app description",
    add_completion=False,
)

def version_callback(flag: bool) -> None:
     """Show application name and version"""
     if flag: 
        typer.echo(f"{__app_name__} v{__version__}")
        raise typer.Exit()
    
def v_log(msg: str) -> None:
    """Log message if verbose mode is enabled."""
    if state.verbose:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            typer.secho(f"[{timestamp}] ", fg=typer.colors.CYAN, nl=False)
            typer.secho(msg, fg=typer.colors.CYAN)
 
@app.callback()
def callback(
     version: Annotated[
         bool,
         typer.Option(
             "--version",
             "-v",
             help="Show version and exit.",
             callback=version_callback,
             is_eager=True,
         )
     ] = False,
     verbose: Annotated[
         bool,
         typer.Option(
             "--verbose",
             "-V",
             help="Enable verbose output.",
         )
     ] = False,
 ) -> None:
    """
    Command options.
    """
    state.verbose = verbose
    if verbose:
        v_log("Verbose mode enabled")

@app.command()
def main(
    name: Annotated[
        str,
        typer.Argument(help="Name of the person to greet")
    ],
    count: Annotated[
        int,
        typer.Option(
            "--count",
            "-c",
            help="Number of times to repeat",
            min=1,
            max=10,
        )
    ] = 1,
    greeting: Annotated[
        str,
        typer.Option(
            "--greeting",
            "-g",
            help="Custom greeting to use."
        )
    ] = "Howdy",
) -> None:
    """
    Main command that greets someone. Supports custom greetings and repeat count.
    """
    v_log(f"Starting main command with parameters:")
    v_log(f"    - name: {name}")
    v_log(f"    - count: {count}")
    v_log(f"    - greeting: {greeting}")
    
    for i in range(count):
        v_log(f"Printing greeting {i+1} of {count}")
        message = f"{greeting}, {name}!"
        
        if state.verbose:
            typer.secho("\t🖕 ", fg=typer.colors.BRIGHT_WHITE, nl=False)
            typer.secho(message, fg=typer.colors.BRIGHT_WHITE)
        else:
            typer.echo(message)
        
    v_log("Main command complete")
    
@app.command()
def config(
    setting: Annotated[
        str,
        typer.Argument(help="Setting name to get/set")
    ],
    value: Annotated[
        Optional[str],
        typer.Argument(help="Value to set (if omitted, shows current value)")
    ] = None,
) -> None: 
    """
    Config command to get/set the setting value.
    """
    v_log(f"Starting config command with parameters:")
    v_log(f"    - name: {setting}")
    v_log(f"    - count: {value}")
    
    if value is None:
        typer.echo(f"Current value of {setting}: [placeholder]")
    else:
        typer.echo(f"Setting {setting} to: {value}")
        
    v_log("Config command complete")

if __name__ == "__main__":
    app()