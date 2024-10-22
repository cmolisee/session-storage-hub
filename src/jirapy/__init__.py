#  jirapy/__init__.py

__app_name__ = "Jirapy"
__version__ = "0.1.0"

(
    SUCCESS,
    DIR_ERROR,
    FILE_ERROR,
    MISC_ERROR
) = range(4)

ERRORS = {
    DIR_ERROR: "Directory Error...",
    FILE_ERROR: "File Error...",
    MISC_ERROR: "Misc. (unknown) Error..."
}

from .cli import *