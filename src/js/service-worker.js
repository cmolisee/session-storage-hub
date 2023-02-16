chrome.runtime.onMessage.addListener(async function (message, sender, response) {
    switch (message?.initiator) {
        case 'WEBPAGE':
            const key = sender.tab.id;
            const dataObject = {}
            dataObject[key] = message.data;
            chrome.storage.local.set(dataObject);
            break;
        case 'EXTENSION':
            // getting connection issues trying to send data from extenstion to sw to content
            break;
        default: 
            // do something default
            console.log('something sent a message that is not webpage or extension...');
    }
});

// need listener for tabs to remove values from storage when tab closes