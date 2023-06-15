/* This code is a self-executing anonymous function that sets up a message listener for messages sent
from the webpage with the initiator 'WEBPAGE'. If the message is received, it sends the message to
the Chrome runtime using `chrome.runtime.sendMessage()`. */
(function () {
    /* This code sets up a message listener for messages sent from the webpage with the initiator
    'WEBPAGE'. If a message is received with this initiator, it checks if the Chrome runtime is
    available and sends the message to the Chrome runtime using `chrome.runtime.sendMessage()`. */
    window.addEventListener(
        'message',
        function (e) {
            if (e.data.initiator && e.data.initiator === 'WEBPAGE') {
                if (chrome.runtime?.id) {
                    chrome.runtime.sendMessage(e.data);
                }
            }
        },
        false
    );

    /* This code sets up a listener for messages sent from the Chrome runtime. When a message is
    received, it retrieves the data from the message and stores it in the session storage of the
    current webpage. It then dispatches an event to notify other parts of the webpage that the
    session storage has been updated. Finally, it sends a response back to the Chrome runtime with a
    message indicating that the session storage items have been pasted. The `async` keyword
    indicates that the function uses asynchronous operations, and the `return true` statement
    indicates that the listener should be kept active for future messages. */
    chrome.runtime.onMessage.addListener(async function (
        message,
        sender,
        response
    ) {
        const data = message;
        Object.entries(data).forEach((entry) => {
            sessionStorage.setItem(entry[0], entry[1]);
        });

        window.dispatchEvent(new Event('storage'));
        response('Session Storage Items have been pasted');

        return true;
    });

    const sessionStorageScript = chrome.runtime.getURL(
        'js/session-storage-script.js'
    );
    injectSessionStorageScript(sessionStorageScript, 'body');

    /**
     * This function injects a script file into the HTML document's body element.
     * @param filePath - The file path of the script that needs to be injected into the HTML document.
     * This can be a relative or absolute path to the script file.
     * @param tag - The `tag` parameter is a string representing the HTML tag name of the element where
     * the script element will be appended to. This function is designed to inject a script element
     * into an HTML page, and the `tag` parameter specifies where the script element will be appended
     * to. For example, if `
     */
    function injectSessionStorageScript(filePath, tag) {
        const bodyEle = document.getElementsByTagName(tag)[0];
        const scriptEle = document.createElement('script');

        scriptEle.setAttribute('type', 'text/javascript');
        scriptEle.setAttribute('src', filePath);
        bodyEle.appendChild(scriptEle);
    }
})();
