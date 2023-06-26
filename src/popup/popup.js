import JSONViewer from '../js/json-viewer.js';
import { defaultSettings, updateRootStyles } from '../options/options.js';

const currentSessionStorageData = {};
const currentSessionStorageElements = [];

chrome.storage.onChanged.addListener(function (changes, areaName) {
	if (areaName === 'local' && !changes.clipboard && !changes.settings) {
		Object.keys(changes).forEach((key) => {
			const updateObject = changes[key].newValue;
			Object.assign(currentSessionStorageData, updateObject);
		});

		buildSessionStorageElements(currentSessionStorageData);
		updateViewWithCurrentData(currentSessionStorageData);
	}
});

window.addEventListener('DOMContentLoaded', async function () {
	const currentTab = await chrome.tabs.query({
		active: true,
		lastFocusedWindow: true,
	});
	const currentTabId = currentTab[0].id.toString();

	chrome.storage.local
		.get(currentTabId)
		.then(async (response) => {
			const obj = await response;
			return obj[currentTabId];
		})
		.then((data) => {
			Object.assign(currentSessionStorageData, data);

			buildSessionStorageElements(currentSessionStorageData);
			updateViewWithCurrentData(currentSessionStorageData);
		});

	chrome.storage.sync.get(defaultSettings, (settings) => {
		updateRootStyles(settings.extensionTheme, settings.codeTheme);
	});
});

const toastEle = document.getElementById('toast');
const optionsButtonEle = document.querySelector('#optionsButton');
const listEle = document.querySelector('.extUtil__tableList');
const viewEle = document.querySelector('.extUtil__tableView');
const copyButtonEle = document.querySelector('.copyButton');
const pasteButtonEle = document.querySelector('.pasteButton');
const selectAllButtonEle = document.querySelector('.selectAll');
const unselectAllButtonEle = document.querySelector('.unselectAll');

optionsButtonEle.addEventListener('click', function () {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL('options.html'));
	}
});

copyButtonEle.addEventListener('click', function (e) {
	copySelectedToStorageClipboard();
	createAndShowNotification('Session Storage items have been copied');
});

pasteButtonEle.addEventListener('click', function (e) {
	getClipboardObject().then((obj) => {
		if (!Object.keys(obj.clipboard).length) {
			createAndShowNotification('Clipboard is empty');
		} else {
			dispatchPasteEvent(obj.clipboard);
		}
	});
});

selectAllButtonEle.addEventListener('click', function (e) {
	e.preventDefault();
	console.log('select all');
	const inputElems = document.querySelectorAll('.extUtil__ssItem input');

	inputElems.forEach((input) => {
		input.checked = true;
	});
});

unselectAllButtonEle.addEventListener('click', function (e) {
	e.preventDefault();
	console.log('unselect all');
	const inputElems = document.querySelectorAll('.extUtil__ssItem input');

	inputElems.forEach((input) => {
		input.checked = false;
	});
});

/**
 * This function builds and populates a list of checkboxes and labels based on the data passed in, and
 * adds event listeners to update the view when a label is clicked.
 * @param data - The `data` parameter is an object containing key-value pairs representing the data
 * stored in the session storage. The keys are strings representing the names of the stored items, and
 * the values are the corresponding data values.
 */
async function buildSessionStorageElements(data) {
	while (listEle.firstChild) {
		listEle.removeChild(listEle.firstChild);
	}

	Object.entries(data).forEach((item, i) => {
		const itemEle = document.createElement('div');
		const id = item[0];

		itemEle.classList.add('extUtil__ssItem');

		const inputEle = document.createElement('input');
		inputEle.type = 'checkbox';
		inputEle.id = id;
		inputEle.value = true;
		inputEle.checked = true;

		const labelEle = document.createElement('p');
		if (i === 0) {
			labelEle.classList.add('selected');
		}
		labelEle.innerHTML = id.replace(/(.{17})..+/, '$1&hellip;');
		labelEle.addEventListener('click', function (e) {
			e.preventDefault();

			const current = document.querySelector(
				'.extUtil__ssItem p.selected'
			);
			if (e.target === current) {
				return;
			}

			current.classList.remove('selected');
			e.target.classList.add('selected');

			updateViewWithCurrentData(currentSessionStorageData);
		});

		itemEle.appendChild(inputEle);
		itemEle.appendChild(labelEle);
		listEle.appendChild(itemEle);
		currentSessionStorageElements.push(itemEle);
	});
}

/**
 * The function updates the view element with the current data based on the selected input element.
 * @param data - The `data` parameter is an object that contains the data to be displayed in the view.
 * It is used to filter the data based on the currently selected input element and then display the
 * filtered data in the view.
 * @returns nothing (i.e., `undefined`) if there is no current selection or if the selected input
 * element is not found.
 */
async function updateViewWithCurrentData(data) {
	const currentSelection = document.querySelector(
		'.extUtil__ssItem:has(p.selected)'
	);

	if (!currentSelection) {
		return;
	}

	const selectedInputEle = currentSelection.querySelector('input');

	if (!selectedInputEle) {
		return;
	}

	const dataKey = selectedInputEle.id;

	viewEle.innerHTML = '';

	Object.entries(data).forEach((item) => {
		const key = item[0];

		if (dataKey === key) {
			JSONViewer({ data: item[1], parentEle: viewEle });
		}
	});
}

/**
 * This function creates and displays a notification message in a notification bar element.
 * @param message - The message parameter is a string that represents the text message to be displayed
 * in the notification.
 * @returns If `notificationBarEle` is falsy (e.g. undefined, null), the function will return without
 * doing anything.
 */
function createAndShowNotification(message) {
	if (!toastEle) {
		return;
	}

	if (toastEle.innerHTML) {
		toastEle.style.cssText = 'transform:translateY(100%);opacity:0;';
		toastEle.innerHTML = '';
	}

	const toastBodyEle = document.createElement('div');
	toastBodyEle.classList.add('toast__body');

	const toastTextEle = document.createElement('p');
	toastTextEle.classList.add('toast__text');
	toastTextEle.innerHTML = message;

	toastBodyEle.appendChild(toastTextEle);

	toastEle.appendChild(toastBodyEle);

	toastEle.style.cssText = 'transform:translateY(0);opacity:1;';

	setTimeout(function () {
		if (toastEle.innerHTML) {
			toastEle.style.cssText = 'transform:translateY(100%);opacity:0;';
			toastEle.innerHTML = '';
		}
	}, 3000);
}

/**
 * This function copies selected items to the storage clipboard by removing unchecked items from the
 * current session storage data.
 */
// TODO: bug - we seem to be copying escape characters and escaping the escape characters...
function copySelectedToStorageClipboard() {
	const allUncheckedElems = document.querySelectorAll(
		'.extUtil__ssItem input:not(:checked)'
	);
	const clipboardObject = Object.assign({}, currentSessionStorageData);
	allUncheckedElems.forEach((inputEle) => {
		const id = inputEle.id;

		delete clipboardObject[id];
	});

	chrome.storage.local.set({ clipboard: clipboardObject });
}

/**
 * This function retrieves the clipboard object from the local storage in a Chrome extension.
 * @returns An object containing the value of the 'clipboard' key from the local storage of the Chrome
 * browser. The function is asynchronous and returns a promise that resolves to the object.
 */
async function getClipboardObject() {
	return await chrome.storage.local.get(['clipboard']);
}

/**
 * This function dispatches a paste event to the active tab in the Chrome browser and displays a
 * notification with the result.
 * @param obj - The `obj` parameter is an object that contains the data to be pasted. It is passed as a
 * message to the content script of the currently active tab using the `chrome.tabs.sendMessage`
 * method. The content script will then handle the pasting of the data.
 */
async function dispatchPasteEvent(obj) {
	const currentWindow = await chrome.windows.getCurrent();
	const tabs = await chrome.tabs.query({
		active: true,
		windowId: currentWindow.id,
	});
	const currentTab = await tabs[0].id;

	chrome.tabs.sendMessage(parseInt(currentTab), obj, function (res) {
		if (chrome.runtime.lastError && chrome.runtime.lastError.message) {
			createAndShowNotification(
				'Error Pasting: ' + chrome.runtime.lastError.message
			);
		} else {
			createAndShowNotification(res);
		}
	});
}
