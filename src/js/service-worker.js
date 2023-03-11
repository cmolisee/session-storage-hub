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

// need listener for tabs to remove values from storage when tab closes
