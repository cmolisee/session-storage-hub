(function () {
    window.addEventListener('storage', function () {
        sendSessionStorageData('UPDATE',);
    },);

    sendSessionStorageData();

    function sendSessionStorageData() {
        const data = JSON.stringify(sessionStorage,);

        window.postMessage({
            initiator: 'WEBPAGE',
            data: data,
        },);
    }
})();
