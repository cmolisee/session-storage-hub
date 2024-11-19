include local.mk
VENV = ~/Downloads/venv/jkpy

install:
	@if [ ! -d "venv" ]; then \
		python3 -m venv $(VENV); \
	fi
	$(VENV)/bin/pip3 install -q build
	$(VENV)/bin/python3 -m build
	$(VENV)/bin/pip3 install dist/jkpy-0.1.0.tar.gz

