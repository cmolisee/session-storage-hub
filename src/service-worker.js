console.log('service worker',);

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

const tabby = await getCurrentTab();
console.log(tabby);

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
const a = await chrome.storage.session.get(["blah"]);
console.log(Object.keys(a));

const b = await chrome.storage.local.get(["blah"]);

const c = await chrome.storage.sync.get(["blah"]);

console.log(Object.keys(b));
console.log(Object.keys(c));