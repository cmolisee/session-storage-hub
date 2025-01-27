# Jira KP(y)
Terminal based application for building statistics on Jira issues.

## tl;dr
1. Clone the repository `git clone https://github.com/cmolisee/jkpy.git` or `git clone git@github.com:cmolisee/jkpy.git`.
3. Install python `brew install python`.
4. Get your email associated with JIRA and create an API token in JIRA.
5. Run `make setup email=<your_email> token=<your_token>`.
6. Add targets to the `local.mk` to run the program using `make <target_name>` or start the venv (see below).

## Pre-Installation
Ensure you have the following:
1. `python3`.
2. `pip3` (or similar).

## Install python3
1. `brew install python`.
2. verify with `python --version` and see version 3+.

If you installed correctly then `pip3` and `venv` should be installed with `python3`.

## Install Application
1. Pull the main branch `git clone https://github.com/cmolisee/jkpy.git` or `git clone git@github.com:cmolisee/jkpy.git`.
2. Install with `make install`

You can manually install as follows:
    1. `python3 -m venv ~/Downloads/venv/jkpy` or a path of your choice.
    2. `your-venv-path/bin/pip3 install -q build`.
    3. `your-venv-path/bin/python3 -m build`.
    4. `your-venv-path/bin/pip3 install dist/jkpy-0.1.0.tar.gz`.

`~/Downloads/venv/jkpy` is the default VENV path set in the Makefile.
You can update this to create the python venv in a path of your choice by editing the Makefile.

## Running Inside venv
venv (or similar) is simply a container environment to run python. To run custom commands from the terminal you must
start your venv manually:

`source your-venv-path/bin/activate` (i.e. `source ~/Downloads/venv/jkpy/bin/activate`)

This will start the venv so that any commands you run with `pip3`, `python3`, or other installed packages in this environment will be recognized.
If you installed the application as defined above then you will be able to run `jkpy` without the need for `python3` command. As long as the venv
is active you can run the application or any other installed python packages.

To deactivate the venv simply run `deactivate`.

## Makefile
The project comes with a defaul makefile called `Makefile` which includes the target to install the project. This default
makefile also imports a file called `local.mk` which is intended for user defined targets. This is helpful in creating snippets
that you can run without having to activate and deactivate your venv.

The project Makefile includes:
* VENV global variable which is used with `make install` target to create the venv for this application. This is important for running
other targets if you have a `local.mk` file
* `include local.mk` which is basically an import for your local makefile targets.

## `local.mk` Example Targets
For ease of use you can update the Makefile with your own commands. Notice the use of `$(VENV)/bin/...` as a special requirement
to running `jkpy` commands without activating the venv.

Example 1:

``run1:
    $(VENV)/bin/jkpy -d -s -j "Labels=Code" -p "~/Desktop/output.txt" -l "a,b,c"
``

You can then run the above command with `make run1` and it will execute the command in its own subshell.
* `$(VENV)` is the venv path variable specified in the Makefile and should be the same path you used when running install.
* If you installed manually or created the venv at a different path then make sure you use that path with `/bin/jkpy` appended to it.

Note: This is the same command as described at the bottom of the 'Basic Usage'

***

Example 2:

``run2:
    $(VENV)/bin/jkpy -d -s -j $(ARG1) -p $(ARG2) -l $(ARG3)
``

This is similar to example 1 except you can pass arguments.
`make run2 ARG1='"Labels=Code"' ARG2='"~/Desktop/output.txt"' ARG3='"a,b,c"'`
* Notice the single quote and the double quote. Arguments for jkpy need to be wrapped in double quotes and to pass those arguments properly 
through the Makefile command requires this syntax (or you can use escaped double quotes `"\"Labels=Code\""`)


## Basic Usage
| option 	| shortcut 	| description 	|
|---	|---	|---	|
| --help 	|  	| (opt) Show all options for jkpy application. 	|
| --debug 	| -d 	| (opt) Show additional debug statements in the console when running the program. 	|
| --show-table 	| -s 	| (opt) Show a table of the results in the terminal. 	|
| --labels 	| -l 	| (opt) Specifies the labels to be used on the full dataset to create subsets. The value for this should be a comma separated string (i.e. a,b,c,d). 	|
| --path 	| -p 	| (opt) Specify the export path for results. Saves the full dataset to the 'dataset' sheet and the results to 'results' sheet. 	|
| --jql 	| -j 	| (required) Specify the jql to use for selecting the target dataset. Application will exit if not provided. 	|
| --token 	| -t 	| (opt/required) Set the api token to make requests. This only needs to be set once and will be saved to a secret file. If not set the application will exit. 	|
| --email 	| -e 	| (opt/required) Set the user email to make requests. This only needs to be set once and will be saved to a secret file. If not set the application will exit. 	|
| --version 	| -v 	| (opt) Shows the application name and version. 	|

***

`jkpy [-e|--email] your-email` to set the email.

***

`jkpy [-t|--token] your-api-token` to set the api token.

***

`jkpy -d -s -j "Labels=Code" -p "~/Desktop/output.txt" -l "a,b,c"`
* `-d` will show debug logs in terminal.
* `-s` will print table to terminal.
* `-j` will request the dataset for all issues where 'Code' is a label.
* `-p` will export results to that path. The file extension will be replaced with `.xlsx`.
* `-l` will build additional statistics on subsets where issues from the main dataset includ the specified labels.

Note: arguments must be strings.

## Output
When running `jkpy` the following stats will be generated on all datasets:

| Statistic 	| Description 	|
|---	|---	|
| dataset_name 	| Name of the dataset. 	|
| total_issues 	| Sum of all issues in this dataset. 	|
| story_point_sum 	| Sum of all story point values in this dataset. 	|
| total_time_spent 	| Sum of all time tracking in this dataset. Time will be displayed in "days, HH:MM:ss". 	|
| total_no_time_tracking 	| Sum of all tickets that have no time tracked in this dataset. 	|
| total_enhancements 	| Sum of all tickets with 'Enhancement' label in this dataset. 	|
| total_bugs 	| Sum of all tickets with 'Bug' label in this dataset. 	|
| total_defects 	| Sum of all tickets with 'Defect' label in this dataset. 	|
| total_spikes 	| Sum of all tickets with 'Spike' label in this dataset. 	|
| story_point_average 	| 'story_point_sum' divided by 'total_issues'. This is displayed with up to 3 significant digits. 	|
| no_tracking_deficit 	| 'total_no_time_tracking' divided by 'total_issues' converted to a percentage (*100). This is displayed with up to 3 significant digits. 	|

When using the `--path` or `-p` command, an excel sheet (.xlsx) will be created with 2 sheets. The first sheet will be named 'dataset'
and will contain the entire dataset pulled from jira. The second sheet will be named 'results' and will contain the statistics for all datasets. 
This file will be created and saved to the path specified in the command.

When using the `--show-table` or `-s` command, the results will be printed to the terminal in a formatted table.
