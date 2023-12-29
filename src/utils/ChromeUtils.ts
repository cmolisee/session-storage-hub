import { Themes } from '../types/types';

export const getCurrentTabUId = (callback: (id?: number) => void): void => {
	if (!chrome?.tabs) {
		console.error('Chrome api is not available.');
		return;
	}

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
	if (!chrome?.storage) {
		console.error('Chrome api is not available.');
		return;
	}

	chrome.storage.sync.set({ options: options }, () => {
		return callback && callback();
	});
};

export const requestData = (key: string, callback?: (items: any) => void) => {
	if (!chrome?.storage) {
		console.error('Chrome api is not available.');
		return;
	}

	chrome.storage.sync.get(key, (items) => {
		return callback && callback(items);
	});
};
