export const getCurrentTabUId = (callback: (id?: number) => void): void => {
	const queryInfo = { active: true, currentWindow: true };

	chrome.tabs &&
		chrome.tabs.query(queryInfo, (tabs) => {
			callback(tabs.length ? tabs[0].id : 0);
		});
};
