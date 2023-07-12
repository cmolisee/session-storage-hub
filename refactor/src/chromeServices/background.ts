export {}

// install, extension update, or chrome update
chrome.runtime.onInstalled.addListener((details) => {
    console.log('[background.js] onInstalled', details);
});

chrome.runtime.onConnect.addListener((port) => {
    console.log('[background.js] onConnect', port);
});

chrome.runtime.onStartup.addListener(() => {
    console.log('[background.js] onStartup');
});

// before unload
chrome.runtime.onSuspend.addListener(() => {
    console.log('[background.js] onSuspend');
});