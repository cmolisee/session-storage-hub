/* This is an immediately invoked function expression (IIFE) that listens for changes in the
sessionStorage and sends the updated data to the parent window using postMessage. It also sends the
initial sessionStorage data when the function is first called. The `Object.assign()` method is used
to create a copy of the sessionStorage object to avoid any reference issues. 
This script is injected to the DOM via the content-script.js file. */
(function () {
    window.addEventListener('storage', function () {
        sendSessionStorageData('UPDATE');
    });

    sendSessionStorageData();

    function sendSessionStorageData() {
        const data = Object.assign({}, sessionStorage);

        window.postMessage({
            initiator: 'WEBPAGE',
            data: data,
        });
    }
})();
