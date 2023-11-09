!function(){"use strict";var e=function(e){return e[e.Webpage=0]="Webpage",e[e.Extension=1]="Extension",e}({}),t=function(e){return e[e.Request=0]="Request",e[e.Update=1]="Update",e[e.Post=2]="Post",e[e.Check=3]="Check",e}({});var r=function(e,t,r,n){return n.id===chrome.runtime.id&&r.from===e&&r.action===t},n=function(n,s,a){if(r(e.Extension,t.Request,n,s)){var o=Object.assign({},sessionStorage);return a({error:o?null:"Error retrieving session storage",data:o}),!0}return!1},s=function(n,s,a){if(r(e.Extension,t.Update,n,s)){try{var o,i;Object.entries(null!==(o=null===(i=n.message)||void 0===i?void 0:i.clipboard)&&void 0!==o?o:{}).forEach((function(e){sessionStorage.setItem(e[0],e[1])})),a({error:null,data:Object.assign({},sessionStorage)})}catch(u){a({error:"Error updating session storage data",data:null})}return!0}return!1},a=function(n,s,a){if(r(e.Extension,t.Check,n,s)){try{chrome.storage.sync.get("versionData",(function(e){if(n.message&&n.message.timestamp&&!n.message.forceCheck&&e&&e.timestamp&&!((n.message.timestamp-e.timestamp)/2777777>5))return a({error:null,data:e}),!0;fetch("https://api.github.com/repos/cmolisee/session-storage-hub/releases/latest").then((function(e){return e.json()})).then((function(e){var t={isUpToDate:"4.1.2"===e.tag_name.slice(1),timestamp:(new Date).getTime(),releaseUrl:e.html_url};a({error:null,data:t})})).catch((function(e){return console.log(e)}))}))}catch(o){a({error:"Error checking for updated release",data:{}})}return!0}return!1};chrome.runtime.onMessage.addListener(n),chrome.runtime.onMessage.addListener(s),chrome.runtime.onMessage.addListener(a)}();
//# sourceMappingURL=content.js.map