VENV = ~/Downloads/venv/jkpy
install:
	@if [ ! -d "venv" ]; then \
		python3 -m venv $(VENV); \
	fi
	$(VENV)/bin/pip3 install -q build
	$(VENV)/bin/python3 -m build
	$(VENV)/bin/pip3 install dist/jkpy-0.1.0.tar.gz
example: 
	$(VENV)/bin/jkpy -s -j "Sprint in openSprints() AND Sprint not in futureSprints()" -p "~/Desktop/jkpy_output.xlsx" -l "QC-Only,QC-QA"
withArgs: 
	$(VENV)/bin/jkpy -s -j $(arg1) -p $(arg2) -l $(arg3)