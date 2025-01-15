TIGERS = Cody-Molisee,Dalen-Noice,Erick-Wakayu,Kaitlyn-Prerost
BARDS = Eric-Feuerstein,Juan-Echevarria,Trixi-Jansuy,Kamila-Kinel
SLINGERS = Harrison-Su,Kyle-Magdales,Arron-Abay

labels = $(TIGERS),$(BARDS),$(SLINGERS)
path = ~/Desktop/output.xlsx

# jql based on this filter https://creditonebank.atlassian.net/issues/?filter=18890
# make byMonth month=8 
# 	optional: path=~/Desktop/output.xlsx
#  	optional: labels=<all dev labels>
byMonth: 
	$(VENV)/bin/jkpy -s -j "\"Team Name[Dropdown]\" in (DPM-Web-Engineering, DPM-WE-Business-Bards, DPM-Code-Freeze, DPM-WE-Moose-Tigers, DPM-WE-Spell-Slingers) and status CHANGED TO (Closed, Deployed, \"Ready for Deployment\", Done, Completed) AFTER $(shell date -v$(month)m -v1d +%Y-%m-%d) BEFORE $(shell date -v$(month)m -v+1m -v1d -v-1d +%Y-%m-%d) ORDER BY created DESC" -p $(path) -l $(labels)