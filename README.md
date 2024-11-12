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

**Note: You can change or alter the venv path by editing the makefile**


# Developer Notes
Building and installation is the same as above. Otherwise, manual installation and running is as follows:
1. `python3 -m venv ~/Downloads/venv/jkpy` or your path of choice
2. `source ~/Downloads/venv/jkpy/bin/acitvate` or your path of choice with '/bin/activate' appended to it

To deactive simply enter `deactivate`.
* it might show an error but that error is false *

To install and build with setuptools from the root
3. `pip3 install -q build`
4. `python3 -m build`

A.whl and a tar.gz file will be created in the dist/ folder of the project.
5. install to your venv with `pip3 install dist/jkpy-0.1.0.tar.gz`
6. run with `jkpy` (hint: use `jkpy --help` for details on how to use)