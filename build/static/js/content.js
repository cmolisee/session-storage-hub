!function(){"use strict";var e=function(e){return e[e.Webpage=0]="Webpage",e[e.Extension=1]="Extension",e}({}),t=function(e){return e[e.Request=0]="Request",e[e.Update=1]="Update",e[e.Post=2]="Post",e}({}),n=function(e,t,n,r){return r.id===chrome.runtime.id&&n.from===e&&n.action===t},r=function(r,s,o){if(n(e.Extension,t.Request,r,s)){var i=Object.assign({},sessionStorage);o({error:i?null:"Error retrieving session storage",data:i})}},s=function(r,s,o){if(n(e.Extension,t.Update,r,s))try{var i,a;Object.entries(null!==(i=null===(a=r.message)||void 0===a?void 0:a.clipboard)&&void 0!==i?i:{}).forEach((function(e){sessionStorage.setItem(e[0],e[1])})),o({error:null,data:Object.assign({},sessionStorage)})}catch(u){o({error:"Error updating session storage data",data:null})}};chrome.runtime.onMessage.addListener(r),chrome.runtime.onMessage.addListener(s)}();
//# sourceMappingURL=content.js.map