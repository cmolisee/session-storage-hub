import {
	Action,
	IChromeMessage,
	IMessageResponse,
	Sender,
	TVersionData,
} from '../types/types';

type TResponse = (response?: IMessageResponse) => void;

const validateSender = (
	expectedSender: Sender,
	expectedAction: Action,
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender
) => {
	return (
		sender.id === chrome.runtime.id &&
		message.from === expectedSender &&
		message.action === expectedAction
	);
};

const requestMessageListener = (
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: TResponse
) => {
	if (validateSender(Sender.Extension, Action.Request, message, sender)) {
		const data = JSON.parse(JSON.stringify(sessionStorage));

		response({
			error: !data ? 'Error retrieving session storage' : null,
			data: data,
		});
		return true; // we will eventually return a response
	}
	return false; // do not expect a response
};

const updateMessageListener = (
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: TResponse
) => {
	if (validateSender(Sender.Extension, Action.Update, message, sender)) {
		try {
			Object.entries(message.message?.updatedData ?? {}).forEach((e) => {
				sessionStorage.setItem(e[0], e[1] as string);
			});

			const data = Object.assign({}, sessionStorage);
			response({ error: null, data: data });
		} catch {
			response({
				error: 'Error updating session storage data',
				data: null,
			});
		}
		return true; // we will eventually return a response
	}
	return false; // do not expect a response
};

const cleanMessageListener = (
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: TResponse
) => {
	if (validateSender(Sender.Extension, Action.Clean, message, sender)) {
		try {
			sessionStorage.clear();
			Object.entries(message.message.data).forEach((e) => {
				sessionStorage.setItem(e[0], e[1] as string);
			});

			const data = Object.assign({}, sessionStorage);
			response({ error: null, data: data });
		} catch {
			response({
				error: 'Error cleaning session storage data',
				data: null,
			});
		}
		return true; // we will eventually return a response
	}
	return false; // do not expect a response
};

const clearMessageListener = (
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: TResponse
) => {
	if (validateSender(Sender.Extension, Action.Clear, message, sender)) {
		try {
			sessionStorage.clear();
			response({ error: null, data: {} });
		} catch {
			response({
				error: 'Error clearing session storage data',
				data: null,
			});
		}
		return true; // we will eventually return a response
	}
	return false; // do not expect a response
};

const fillStorageMessageListener = (
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: TResponse
) => {
	if (validateSender(Sender.Extension, Action.FillStorage, message, sender)) {
		try {
			let x = 8;

			while (x > 0) {
				try {
					window.sessionStorage.setItem(
						'@utility-fill-' +
						window.sessionStorage.length.toString(),
						'@'.repeat(2 ** x)
					);
				} catch (e) {
					x -= 1;
				}
			}

			const data = Object.assign({}, sessionStorage);
			response({ error: null, data: data });
		} catch {
			response({
				error: 'Error filling session storage.',
				data: null,
			});
		}
		return true; // we will eventually return a response
	}
	return false; // do not expect a response
};

function convertMsToHr(ms: number) {
	return ms / 2777777;
}

// messageListeners must return a boolean so they cannot be async
const checkReleaseListener = (
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: TResponse
) => {
	if (validateSender(Sender.Extension, Action.Check, message, sender)) {
		try {
			// request release information from local storage
			chrome.storage.sync.get('versionData', (data: TVersionData) => {
				// if it does not exist, no message passed in message request, or >5hrs since last check
				// get data from api request
				if (
					!message.message ||
					!message.message.timestamp ||
					message.message.forceCheck ||
					!data ||
					!data.timestamp ||
					convertMsToHr(message.message.timestamp - data.timestamp) >
					5
				) {
					fetch(
						'https://api.github.com/repos/cmolisee/session-storage-hub/releases/latest'
					)
						.then((res) => {
							return res.json();
						})
						.then((releaseData) => {
							const latestVersion =
								releaseData['tag_name'].slice(1);

							const resData: TVersionData = {
								isUpToDate:
									latestVersion === (VERSION as string),
								timestamp: new Date().getTime(),
								releaseUrl: releaseData['html_url'],
							};

							response({ error: null, data: resData });
						})
						.catch((err) => {
							return console.error('Session Storage Hub:', err);
						});
				} else {
					// otherwise data exists, is up to date
					response({ error: null, data: data });
					return true;
				}
			});
		} catch {
			response({
				error: 'Error checking for updated release',
				data: {},
			});
		}
		return true; // we will eventually return a response
	}
	return false; // do not expect a response
};

export const copyStorageToClipboard = (
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: TResponse
) => {
	if (validateSender(Sender.Extension, Action.Copy, message, sender)) {
		const keys = message.message.keys;
		const dataToCopy: any = {};
		Object.entries(sessionStorage).forEach(([key, value]: [string, any]) => {
			if (keys.includes(key)) {
				dataToCopy[key] = value;
			}
		});

		response({
			error: null,
			data: dataToCopy,
		});
		return true; // we will eventually return a response
	}
	return false; // do not expect a response
}

const addMessageListener = (
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: TResponse
) => {
	if (validateSender(Sender.Extension, Action.Add, message, sender)) {
		try {
			const itemKey = new Date().getTime().toString();
			sessionStorage.setItem(itemKey, '{}');

			const data = {
				obj: Object.assign({}, sessionStorage),
				itemKey: itemKey,
			}

			response({ error: null, data: data });
		} catch {
			response({
				error: 'Error adding session storage item',
				data: null,
			});
		}
		return true; // we will eventually return a response
	}
	return false; // do not expect a response
};

const deleteMessageListener = (
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: TResponse
) => {
	if (validateSender(Sender.Extension, Action.Delete, message, sender)) {
		try {
			console.log('deleteMessageListener', message);
			message.message?.data.forEach((k: string) => {
				sessionStorage.removeItem(k);
			});

			const data = Object.assign({}, sessionStorage);
			response({ error: null, data: data });
		} catch {
			response({
				error: 'Error adding session storage item',
				data: null,
			});
		}
		return true; // we will eventually return a response
	}
	return false; // do not expect a response
};

const updateKeyMessageListener = (
	message: IChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: TResponse
) => {
	if (validateSender(Sender.Extension, Action.UpdateKey, message, sender)) {
		try {
			const { newKey, oldKey } = message.message;

			sessionStorage.setItem(newKey, sessionStorage.getItem(oldKey) as string);
			sessionStorage.removeItem(oldKey);

			response({ error: null, data: Object.assign({}, sessionStorage) });
		} catch {
			response({
				error: 'Error updating session storage data',
				data: null,
			});
		}
		return true; // we will eventually return a response
	}
	return false; // do not expect a response
};

const main = () => {
	// prevent duplicate listeners
	chrome.runtime.onMessage.removeListener(requestMessageListener);
	chrome.runtime.onMessage.removeListener(updateMessageListener);
	chrome.runtime.onMessage.removeListener(cleanMessageListener);
	chrome.runtime.onMessage.removeListener(clearMessageListener);
	chrome.runtime.onMessage.removeListener(fillStorageMessageListener);
	chrome.runtime.onMessage.removeListener(checkReleaseListener);
	chrome.runtime.onMessage.removeListener(copyStorageToClipboard);
	chrome.runtime.onMessage.removeListener(addMessageListener);
	chrome.runtime.onMessage.removeListener(deleteMessageListener);
	chrome.runtime.onMessage.removeListener(updateKeyMessageListener);

	// Fired when a message is sent from either an extension process or a content script.
	chrome.runtime.onMessage.addListener(requestMessageListener);
	chrome.runtime.onMessage.addListener(updateMessageListener);
	chrome.runtime.onMessage.addListener(cleanMessageListener);
	chrome.runtime.onMessage.addListener(clearMessageListener);
	chrome.runtime.onMessage.addListener(fillStorageMessageListener);
	chrome.runtime.onMessage.addListener(checkReleaseListener);
	chrome.runtime.onMessage.addListener(copyStorageToClipboard);
	chrome.runtime.onMessage.addListener(addMessageListener);
	chrome.runtime.onMessage.addListener(deleteMessageListener);
	chrome.runtime.onMessage.addListener(updateKeyMessageListener);
};

main();
