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
		const data = Object.assign({}, sessionStorage);

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

const main = () => {
	// prevent duplicate listeners
	chrome.runtime.onMessage.removeListener(requestMessageListener);
	chrome.runtime.onMessage.removeListener(updateMessageListener);
	chrome.runtime.onMessage.removeListener(fillStorageMessageListener);
	chrome.runtime.onMessage.removeListener(checkReleaseListener);

	// Fired when a message is sent from either an extension process or a content script.
	chrome.runtime.onMessage.addListener(requestMessageListener);
	chrome.runtime.onMessage.addListener(updateMessageListener);
	chrome.runtime.onMessage.addListener(fillStorageMessageListener);
	chrome.runtime.onMessage.addListener(checkReleaseListener);
};

main();
