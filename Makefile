VENV = ~/Downloads/venv/jkpy
TIGERS = Cody-Molisee,Dalen-Noice,Erick-Wakayu
BARDS = Eric-Feuerstein,Trixi-Jansuy,Juan-Echevarria,Kamila-Kinel
SLINGERS = Kyle-Magdales,Harrison-Su,Ainhoa-Martinez,Arron-Abay
ALL = $(TIGERS),$(BARDS),$(SLINGERS)

install:
	@if [ ! -d "venv" ]; then \
		python3 -m venv $(VENV); \
	fi
	$(VENV)/bin/pip3 install -q build
	$(VENV)/bin/python3 -m build
	$(VENV)/bin/pip3 install dist/jkpy-0.1.0.tar.gz

# All tickets for Moose Tigers
# make tall PATH=<export path>
tall:
	$(VENV)/bin/jkpy -s -j "Sprint in openSprints() AND Sprint not in futureSprints()" -p "$(path)" -l "QC-Only,QC-QA"

# Get Tickets by date range for Bards, Tigers, and Slingers
# make date MONTH=<month 1-12> PATH=<export path>
doneByMonth:
	$(eval START := $(shell date -v$(month)m -v1d +%Y-%m-%d))
	$(eval END := $(shell date -v$(month)m -v+1m -v1d -v-1d +%Y-%m-%d))
	$(VENV)/bin/jkpy -s -j "\"Team Name[Dropdown]\" in (DPM-Web-Engineering, DPM-WE-Business-Bards, DPM-Code-Freeze, DPM-WE-Moose-Tigers, DPM-WE-Spell-Slingers) AND resolved >= $(START) AND resolved <= $(END) AND status in (Closed, Deployed, \"Ready for Deployment\", Done, Completed) AND type not in (Test, TestDeployment, \"Test Plan\", \"Test Set\", \"Test Execution\")" -p "$(path)" -l "$(ALL)"
