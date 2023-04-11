import JSONViewer from '../js/json-viewer.js';
import { defaultSettings, updateRootStyles } from '../options/options.js';

var currentSessionStorageData = {};
var currentSessionStorageElements = [];

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

    chrome.storage.sync.get(
        defaultSettings,
        (settings) => {
            updateRootStyles(settings.extensionTheme, settings.codeTheme);
        }
    );
});

const notificationBarEle = document.querySelector('.extUtil__notificationBar');
const optionsButtonEle = document.querySelector('#optionsButton');
const listEle = document.querySelector('.extUtil__tableList');
const viewEle = document.querySelector('.extUtil__tableView');
const copyButtonEle = document.querySelector('.copyButton');
const pasteButtonEle = document.querySelector('.pasteButton');

optionsButtonEle.addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
});

copyButtonEle.addEventListener('click', function (e) {
    copySelectedToStorageClipboard();
    createAndShowNotification('Checked Session Storage items have been copied');
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

            const current = document.querySelector('.extUtil__ssItem p.selected');
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
            new JSONViewer({ data: item[1], parentEle: viewEle, });
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
    if (!notificationBarEle) {
        return;
    }

    const existingNotificationEle = notificationBarEle.querySelector(
        '.extUtil__notification'
    );

    if (existingNotificationEle) {
        notificationBarEle.removeChild(existingNotificationEle);
    }

    const notificationEle = document.createElement('div');
    notificationEle.classList.add('extUtil__notification', 'alert');

    const iconEle = document.createElement('div');
    iconEle.classList.add('extUtil__notificationIcon', 'alert');
    iconEle.appendChild(document.createElement('i'));

    const textEle = document.createElement('div');
    textEle.classList.add('extUtil__notificationText', 'alert');
    textEle.innerHTML = message;

    notificationEle.appendChild(iconEle);
    notificationEle.appendChild(textEle);

    notificationBarEle.appendChild(notificationEle);

    notificationBarEle.style.display = 'flex';
}

/**
 * This function copies selected items to the storage clipboard by removing unchecked items from the
 * current session storage data.
 */
function copySelectedToStorageClipboard() {
    const allCheckedElems = document.querySelectorAll(
        '.extUtil__ssItem input:not(:checked)'
    );
    const clipboardObject = Object.assign({}, currentSessionStorageData);
    allCheckedElems.forEach((inputEle) => {
        const id = inputEle.id;

        delete clipboardObject[id];
    });

    chrome.storage.local.set({ clipboard: clipboardObject, });
}

/**
 * This function retrieves the clipboard object from the local storage in a Chrome extension.
 * @returns An object containing the value of the 'clipboard' key from the local storage of the Chrome
 * browser. The function is asynchronous and returns a promise that resolves to the object.
 */
async function getClipboardObject() {
    return await chrome.storage.local.get([ 'clipboard', ]);
}

/**
 * This function dispatches a paste event to the active tab in the Chrome browser and displays a
 * notification with the result.
 * @param obj - The `obj` parameter is an object that contains the data to be pasted. It is passed as a
 * message to the content script of the currently active tab using the `chrome.tabs.sendMessage`
 * method. The content script will then handle the pasting of the data.
 */
async function dispatchPasteEvent(obj) {
    const currentTab = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    const currentTabId = currentTab[0].id.toString();
    chrome.tabs.sendMessage(parseInt(currentTabId), obj, function (res) {
        if (chrome.runtime.lastError && chrome.runtime.lastError.message) {
            createAndShowNotification(
                'Error Pasting: ' + chrome.runtime.lastError.message
            );
        } else {
            createAndShowNotification(res);
        }
    });
}