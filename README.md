# jirakpy
Terminal based application for building stats on jira csv files with custom python scripts


# Pre-Installation
You will need to ensure you have the following in order to use this application:
1. python3
2. pip3 or similar

The following [article](https://docs.python-guide.org/starting/install3/osx/) has some decent information on setting up python for mac.

## Install python3
`brew install python`
verify with `python --version` and see version 3+

If you installed correctly then pip3 should be installed with python3

# Install and Run the Program
1. Pull the latest branch
2. run `make install` to setup your virtual environment, build, and install
3. run `source ~/Downloads/venv/jkpy/bin/activate`
4. run the program
    `jkpy --help`
    `jkpy --prompt ...`
5. run `deactivate` to stop the python venv


# Developer Notes
activate the virtual environment assuming you are in terminal at the project root under ~/Documents/jirakpy.
1. `python3 -m venv ~/Downloads/virtual-envs/jirakpy`
2. `source ~/Downloads/virtual-envs/jirakpy/bin/acitvate`

To deactive simply enter `deactivate`.
* it might show an error but that error is false *

To install and build with setuptools from the root
1. `pip3 install -q build`
2. `python3 -m build`

This will create a dist/ in the root with a .whl and a tar.gz of the project.
install it with `pip3 install dist/jirakpy-0.1.0.tar.gz`