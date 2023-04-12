/* This code is adding a listener to the Chrome runtime that listens for messages sent from a webpage.
When a message is received, it checks if the message has an "initiator" property with a value of
"WEBPAGE". If it does, it creates a data object with the key being the ID of the tab that sent the
message and the value being the data contained in the message. It then saves this data object to the
local storage using the Chrome storage API. This allows the extension to store data from webpages
and access it later. */
chrome.runtime.onMessage.addListener(async function (
    message,
    sender,
    response
) {
    if (message?.initiator && message.initiator === 'WEBPAGE') {
        const key = sender.tab.id;
        const dataObject = {};

        dataObject[key] = message.data;
        chrome.storage.local.set(dataObject);
    }
});

// TODO: add listener to remove data from local storage when tab closes.
