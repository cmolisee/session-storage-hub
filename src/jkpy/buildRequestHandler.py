import io
from requests.auth import HTTPBasicAuth

from jkpy.jiraHandler import JiraHandler
from jkpy.utils import parse_date, sys_exit

class BuildRequestHandler(JiraHandler):
    """build default request object"""
    def handle(self, request):
        request.log("BuildRequestHandler().handle().")
        if not request.proceed:
            sys_exit(0, request, "request.proceed is False. Exiting.")
        
        if not request.token:
            sys_exit(1, request, "Could not find jira api token required for authentication.")
        
        if not request.email:
            sys_exit(1, request, "Could not find jira email required for authentication.")

        try:
            headers={ "Accept": "application/json" }
            path=f"https://creditonebank.atlassian.net/rest/api/2/search/jql"
            auth=HTTPBasicAuth(request.email, request.token)
            jql=io.StringIO()
            jql.write("\"Team Name[Dropdown]\" in ")
            jql.write("(" + ', '.join(str(s) for s in request.teamLabels) + ") ") # filter by team labels
            jql.write("and status CHANGED TO ")
            jql.write("(" + ', '.join(str(s) for s in request.statusTypes) + ") ") # filter by status type changed too
            jql.write("AFTER " + parse_date(request.startDate, 1, 1) + " ") # status change date from
            jql.write("BEFORE " + parse_date(request.endDate, 12, 31)  + " ") # status change date too
            jql.write("AND type IN (Task, Story, Epic, Bug, Enhancement) ") # include only valid ticket types
            jql.write("AND labels NOT IN (QA, Content-Only, Release-Management) ") # exclude specific labels
            jql.write("AND Sprint != EMPTY ") # exclude tickets w/o sprint
            jql.write("ORDER BY created DESC")
            fields='assignee,created,customfield_10003,customfield_10014,customfield_10235,customfield_10303,customfield_10157,fixVersion,labels,status,statuscategorychangedate,key,customfield_10020,customfield_10028,timespent'

            request.log(f"JQL Query: {jql.getvalue()}.")
            
            
            request.requestData={
                "type": "default",
                "method": "GET",
                "path": path,
                "headers": headers,
                "query": {
                    'jql': jql.getvalue(),
                    'fields': fields
                },
                "auth": auth,
            }

        except Exception as e:
            sys_exit(1, request, f"exception occured building jira request: {e}")
        
        return super().handle(request)

# [
#     # {
#     #     percent, // % complete based on time spent vs time planned
#     #     progress, // time spent in seconds
#     #     total, // total time spent in seconds
#     # }
#     "aggregateprogress",
#     # sum of all estimated time including adjustments
#     "aggregatetimeestimate",
#     # sum of original estimated time
#     "aggregatetimeoriginalestimate",
#     # sum of all time spent
#     "aggregatetimespent",
#     # user currently assigned
#     "assignee",
#     # project components related to this issue
#     "components",
#     # issue created timestamp
#     "created",
#     # user who created issue
#     "creator",
#     # pull request metadata
#     "customfield_10000",
#     "customfield_10001",
#     "customfield_10002",
#     # approvers
#     "customfield_10003",
#     "customfield_10004",
#     "customfield_10005",
#     "customfield_10006",
#     "customfield_10007",
#     "customfield_10008",
#     "customfield_10009",
#     "customfield_10010",
#     # epic
#     "customfield_10014",
#     "customfield_10015",
#     "customfield_10016",
#     "customfield_10017",
#     # metadata for epic link field
#     # {
#     #     hasEpicLinkFieldDependency ,
#     #     showField,
#     #     nonEditableReason {
#     #         reason,
#     #         message,
#     #     },
#     # }
#     "customfield_10018",
#     "customfield_10019",
#     # Sprnt info
#     # [
#     #     {
#     #         id, // unique sprint id
#     #         name, // sprint name
#     #         state, // closed, open, etc...
#     #         boardId, // board id this sprint belongs to
#     #         goal, // goal for this sprint
#     #         startDate, // sprint start date
#     #         endDate, // sprint end date
#     #         completeDate, // sprint completed date
#     #     }
#     # ]
#     "customfield_10020",
#     "customfield_10021",
#     "customfield_10022",
#     "customfield_10023",
#     "customfield_10024",
#     "customfield_10025",
#     # story points
#     "customfield_10028",
#     "customfield_10031",
#     "customfield_10032",
#     "customfield_10033",
#     "customfield_10035",
#     "customfield_10038",
#     "customfield_10039",
#     "customfield_10040",
#     "customfield_10041",
#     "customfield_10042",
#     "customfield_10043",
#     "customfield_10044",
#     "customfield_10046",
#     "customfield_10047",
#     "customfield_10048",
#     "customfield_10049",
#     "customfield_10050",
#     "customfield_10051",
#     "customfield_10052",
#     "customfield_10054",
#     "customfield_10057",
#     "customfield_10058",
#     "customfield_10059",
#     "customfield_10060",
#     "customfield_10065",
#     "customfield_10066",
#     "customfield_10067",
#     "customfield_10068",
#     "customfield_10071",
#     "customfield_10082",
#     "customfield_10083",
#     "customfield_10087",
#     "customfield_10088",
#     "customfield_10089",
#     "customfield_10090",
#     "customfield_10091",
#     "customfield_10092",
#     "customfield_10094",
#     "customfield_10095",
#     "customfield_10097",
#     "customfield_10098",
#     "customfield_10099",
#     "customfield_10101",
#     "customfield_10102",
#     "customfield_10103",
#     "customfield_10104",
#     "customfield_10105",
#     "customfield_10118",
#     "customfield_10119",
#     "customfield_10121",
#     "customfield_10140",
#     "customfield_10141",
#     "customfield_10142",
#     "customfield_10143",
#     "customfield_10145",
#     "customfield_10146",
#     "customfield_10147",
#     "customfield_10148",
#     "customfield_10149",
#     "customfield_10150",
#     "customfield_10151",
#     "customfield_10152",
#     "customfield_10153",
#     "customfield_10154",
#     "customfield_10155",
#     "customfield_10156",
#     # acceptance criteria
#     "customfield_10157",
#     "customfield_10158",
#     "customfield_10196",
#     "customfield_10211",
#     "customfield_10212",
#     "customfield_10213",
#     "customfield_10214",
#     "customfield_10215",
#     "customfield_10216",
#     "customfield_10217",
#     "customfield_10218",
#     "customfield_10219",
#     "customfield_10220",
#     "customfield_10221",
#     "customfield_10222",
#     "customfield_10223",
#     "customfield_10224",
#     "customfield_10225",
#     "customfield_10226",
#     "customfield_10227",
#     "customfield_10228",
#     "customfield_10229",
#     "customfield_10230",
#     "customfield_10231",
#     "customfield_10232",
#     "customfield_10233",
#     "customfield_10234",
#     # team name
#     "customfield_10235",
#     "customfield_10240",
#     "customfield_10241",
#     "customfield_10242",
#     "customfield_10243",
#     "customfield_10244",
#     "customfield_10245",
#     "customfield_10246",
#     "customfield_10247",
#     "customfield_10248",
#     "customfield_10249",
#     "customfield_10250",
#     "customfield_10251",
#     "customfield_10253",
#     "customfield_10254",
#     "customfield_10264",
#     "customfield_10265",
#     "customfield_10266",
#     "customfield_10279",
#     "customfield_10282",
#     "customfield_10283",
#     "customfield_10284",
#     "customfield_10285",
#     "customfield_10286",
#     "customfield_10287",
#     "customfield_10288",
#     "customfield_10289",
#     "customfield_10290",
#     "customfield_10291",
#     "customfield_10292",
#     "customfield_10293",
#     "customfield_10295",
#     "customfield_10296",
#     "customfield_10297",
#     "customfield_10298",
#     "customfield_10299",
#     "customfield_10300",
#     "customfield_10301",
#     "customfield_10302",
#     # product owner
#     "customfield_10303",
#     "customfield_10304",
#     "customfield_10305",
#     "customfield_10306",
#     "customfield_10307",
#     "customfield_10308",
#     "customfield_10309",
#     "customfield_10320",
#     "customfield_10323",
#     "customfield_10327",
#     "customfield_10328",
#     "customfield_10329",
#     "customfield_10330",
#     "customfield_10331",
#     "customfield_10333",
#     "customfield_10334",
#     "customfield_10336",
#     "customfield_10337",
#     "customfield_10338",
#     "customfield_10339",
#     "customfield_10340",
#     "customfield_10341",
#     "customfield_10342",
#     "customfield_10343",
#     "customfield_10344",
#     "customfield_10345",
#     "customfield_10346",
#     "customfield_10348",
#     "customfield_10349",
#     "customfield_10350",
#     "customfield_10351",
#     "customfield_10352",
#     "customfield_10353",
#     "customfield_10354",
#     "customfield_11385",
#     "customfield_11386",
#     "customfield_11387",
#     "customfield_11388",
#     "customfield_11389",
#     "customfield_11390",
#     "customfield_11391",
#     "customfield_11392",
#     "customfield_11393",
#     "customfield_11394",
#     "customfield_11395",
#     "customfield_11396",
#     "customfield_11397",
#     "customfield_11398",
#     "customfield_11399",
#     "customfield_11414",
#     "customfield_11415",
#     "customfield_11417",
#     "customfield_11418",
#     "customfield_11419",
#     "customfield_11422",
#     "customfield_11423",
#     "description",
#     "duedate",
#     "environment",
#     "fixVersions",
#     "issuelinks",
#     "issuetype",
#     "labels",
#     "lastViewed",
#     "parent",
#     "priority",
#     "progress",
#     "project",
#     "reporter",
#     "resolution",
#     "resolutiondate",
#     "security",
#     "status",
#     "statuscategorychangedate",
#     "subtasks",
#     "summary",
#     "timeestimate",
#     "timeoriginalestimate",
#     "timespent",
#     "updated",
#     "versions",
#     "votes",
#     "watches",
#     "workratio",
# ]