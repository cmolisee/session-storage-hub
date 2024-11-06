output_type_dict = {
    "KPI Statistics": 0,
    "Pie Chart (ticket type)": 1,
    "Bar Chart (ticket status)": 2,
}

kpi_options_dict = {
    "Ticket total": 0,
    "Total story points": 1,
    "Avg story points": 2,
    "Avg story points by sprint": 3,
    "Avg story points by month": 4,
    "Enhancments": 5,
    "Bugs": 6,
    "Defects": 7,
    "Spikes": 8,
    "Tickets w/o tracking": 9,
    "Time tracking deficit": 10,
}

dataset_target_dict = {
    "By my jira filters": 0,
    "By JQL query": 1,
}

keyset_dict = {
    "output_type": output_type_dict,
    "output_statistics": kpi_options_dict,
    "dataset_filter": dataset_target_dict,
    "jira_accountId": str,
    "jira_jql": str,
    "filter_choice": str,
}