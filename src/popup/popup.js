import { ExtSettings } from '../js/ext-settings.js';
import JSONViewer from '../js/json-viewer.js';

var currentSessionStorageData = {};
var currentSessionStorageElements = [];
var extensionSettings = null;

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
    
    extensionSettings = new ExtSettings();
    extensionSettings.render();
});

const notificationBarEle = document.querySelector('.extUtil__notificationBar');
const listEle = document.querySelector('.extUtil__tableList');
const viewEle = document.querySelector('.extUtil__tableView');
const copyButtonEle = document.querySelector('.copyButton');
const pasteButtonEle = document.querySelector('.pasteButton');

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

async function getClipboardObject() {
    return await chrome.storage.local.get([ 'clipboard', ]);
}

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
