"""types"""
#  jkpy/types.py

type_output = {
    "KPI Statistics": 0,
    # "Pie Chart (ticket type)": 1,
    # "Bar Chart (ticket status)": 2,
}

type_request = {
    "By my jira filters": 0,
    "By JQL query": 1,
}

type_key_mapping = {
    "output_type": type_output,
    "dataset_filter": type_request,
    "jira_accountId": str,
    "jira_jql": str,
    "filter_choice": str,
}