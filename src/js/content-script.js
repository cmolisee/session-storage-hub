(function () {
    window.addEventListener(
        'message',
        function (e,) {
            if (e.data.initiator && e.data.initiator === 'WEBPAGE') {
                chrome.runtime.sendMessage(e.data,);
            }
        },
        false,
    );

    chrome.runtime.onMessage.addListener(async function (
        message,
        sender,
        response,
    ) {
        // console.log(message);
        const data = message;
        Object.entries(data,).forEach((entry,) => {
            sessionStorage.setItem(entry[0], JSON.stringify(entry[1],),);
        },);

        window.dispatchEvent(new Event('storage',),);
        response('Session Storage Items have been pasted',);

        return true;
    },);

    const sessionStorageScript = chrome.runtime.getURL(
        'js/session-storage-script.js',
    );
    injectSessionStorageScript(sessionStorageScript, 'body',);

    function injectSessionStorageScript(filePath, tag,) {
        const bodyEle = document.getElementsByTagName(tag,)[0],
            scriptEle = document.createElement('script',);

        scriptEle.setAttribute('type', 'text/javascript',);
        scriptEle.setAttribute('src', filePath,);
        bodyEle.appendChild(scriptEle,);
    }
})();
