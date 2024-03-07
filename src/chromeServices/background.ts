export { };

// install, extension update, or chrome update
chrome.runtime.onInstalled.addListener((details) => {
	console.debug('[background] onInstalled', details);
});

chrome.runtime.onConnect.addListener((port) => {
	console.debug('[background] onConnect', port);
});

chrome.runtime.onStartup.addListener(() => {
	console.debug('[background] onStartup');
});

// before unload
chrome.runtime.onSuspend.addListener(() => {
	console.debug('[background] onSuspend');
});
