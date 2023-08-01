export {};

// install, extension update, or chrome update
chrome.runtime.onInstalled.addListener((details) => {
	console.log('[background] onInstalled', details);
});

chrome.runtime.onConnect.addListener((port) => {
	console.log('[background] onConnect', port);
});

chrome.runtime.onStartup.addListener(() => {
	console.log('[background] onStartup');
});

// before unload
chrome.runtime.onSuspend.addListener(() => {
	console.log('[background] onSuspend');
});
