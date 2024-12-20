export default defineContentScript({
    matches: ["<all_urls>"],
    async main() {
        /** Inject script. */
        async function init() {
            await injectScript('/inject.js', {
                keepInDom: true,
            });
        }
        
        /** Receive updates from webpage and pass to extension */
        windowMessenger.onMessage('updateToExtension', async (message) => {
            return await extensionMessenger.sendMessage('updateFromPage', message.data)
                .then(() => true)
                .catch((error) => {
                    console.debug(error);
                    return false;
                });
        });

        /** Receive updates from extension and pass to webpage */
        extensionMessenger.onMessage('sendToContent', async (message) => {
            return await windowMessenger.sendMessage('updateFromExtension', message.data)
                .then(() => true)
                .catch((error) => {
                    console.debug(error);
                    return false;
                });
        });

        init();
    },
});
