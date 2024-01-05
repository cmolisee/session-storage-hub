import { IChromeMessage, IMessageResponse, Themes } from '../types/types';
import { errorToast } from './Utils';

export function saveOptionData(
	options: { name: Themes },
	callback?: () => void
) {
	if (!chrome?.storage) {
		console.error('Chrome api is not available.');
		return;
	}

	chrome.storage.sync.set({ options: options }, () => {
		return callback && callback();
	});
}

export function requestOptionData(
	key: string,
	callback?: (items: any) => void
) {
	if (!chrome?.storage) {
		console.error('Chrome api is not available.');
		return;
	}

	chrome.storage.sync.get(key, (items) => {
		return callback && callback(items);
	});
}

export function chromeApi(
	chromeMessage: IChromeMessage,
	successCallback: (res: IMessageResponse) => void
) {
	if (!chrome?.tabs) {
		errorToast('503', 'Chrome tabs API is not available.');
	}

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const id = tabs[0].id as number;
		if (!id) {
			errorToast('503', 'Could not retrieve active tab id.');
		}

		chrome.tabs.sendMessage(
			id,
			chromeMessage,
			async (res: IMessageResponse) => {
				if (chrome.runtime.lastError) {
					errorToast(
						'401',
						'Cannot establish connection on this page.'
					);
					return;
				}

				if (res && res.error) {
					errorToast('sendMessageResponseError', res.error);
					return;
				}

				if (res && res.data) {
					successCallback(res);
				} else {
					errorToast(
						'requestError',
						'There was an error retrieving latest release information.'
					);
				}

				return;
			}
		);
	});
}
