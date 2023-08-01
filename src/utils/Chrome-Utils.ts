import { Themes } from '../providers/useTheme';

export const getCurrentTabUId = (callback: (id?: number) => void): void => {
	const queryInfo = { active: true, currentWindow: true };

	chrome.tabs &&
		chrome.tabs.query(queryInfo, (tabs) => {
			callback(tabs.length ? tabs[0].id : 0);
		});
};

export const saveOptions = (
	options: { name: Themes },
	callback?: () => void
) => {
	chrome.storage.sync.set({ options: options }, () => callback && callback());
};

export const requestOptions = (callback?: (items: any) => void) => {
	chrome.storage.sync.get('options', (items) => callback && callback(items));
};
