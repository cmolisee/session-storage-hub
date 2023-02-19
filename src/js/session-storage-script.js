(function () {
    window.addEventListener('storage', function () {
        sendSessionStorageData('UPDATE',);
    },);

    sendSessionStorageData();

    function sendSessionStorageData() {
        const data = Object.assign({}, sessionStorage);

        window.postMessage({
            initiator: 'WEBPAGE',
            data: data,
        },);
    }
})();
