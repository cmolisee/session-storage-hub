# jirapy
Terminal based application for building stats on jira csv files with custom python scripts

# Note
activate the virtual environment assuming you are in terminal at the project root under ~/Documents/jirapy.
1. `python3 -m venv ~/Downloads/virtual-envs/jirapy`
2. `source ~/Downloads/virtual-envs/jirapy/bin/acitvate`

To deactive simply enter 'deactivate'.
* it might show an error but that error is false *

To install and build with setuptools from the root
1. `pip3 install -q build` (idk if this needs to be done every time or not. i'm assuming not)
2. `python3 -m build`

This will create a dist/ in the root with a .whl and a tar.gz of the project.
install it with `pip3 install dist/jirapy-0.1.0.tar.gz`