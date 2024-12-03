include local.mk
VENV = ~/Downloads/venv/jkpy

# make install
install:
	@if [ ! -d "venv" ]; then \
		python3 -m venv $(VENV); \
	fi
	$(VENV)/bin/pip3 install -q build
	$(VENV)/bin/python3 -m build
	$(VENV)/bin/pip3 install dist/jkpy-0.1.0.tar.gz

# make help
help: 
	$(VENV)/bin/jkpy --help

# make setup email=john.doe@creditone.com token=abc123....
setup:
	$(VENV)/bin/jkpy -e $(email) -t $(token) 
