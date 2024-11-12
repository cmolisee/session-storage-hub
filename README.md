# Jira KP(y)
Terminal based application for building statistics on Jira issues.


# Pre-Installation
Ensure you have the following:
1. `python3`.
2. `pip3` (or similar).


## Install python3
1. `brew install python`.
2. verify with `python --version` and see version 3+.

If you installed correctly then `pip3` and `venv` should be installed with `python3`.

# Install and Run the Program
1. Pull the latest branch.
2. run `make install` to setup the project (this includes installing dependencies, building, etc...).
3. run `source ~/Downloads/venv/jkpy/bin/activate`.
__This path is based on the VENV path specified in the Makefile__
4. run the program:
    `jkpy --help`
    `jkpy --prompt ...`
5. run `deactivate` to stop the python venv.

**Note: You can change or alter the venv path by editing the makefile**


# Usage
You will be required to provide a Jira username (email) and an API token. Please reference the API token documentation
on Jira for more information and keep this a secret.

use `jkpy --prompt` command to run the prompt.
If this is your first time running the application you will be asked to provide your email and token. However, once provided the prompt
will not ask again unless the config is deleted.

Use `jkpy --email` or `jkpy --token` to update or set.

For additional usage please see `jkpy --help`.