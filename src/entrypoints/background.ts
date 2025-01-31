import { extensionData } from "@/utils/storage";

export default defineBackground(() => {
    /**
     * Listen for updates from the content script.
     * Update sesson data in the extension.
     */
    extensionMessenger.onMessage('updateFromPage', async (message) => {
        return await extensionData.setValue(message.data)
            .then(() => true)
            .catch((error) => {
                console.debug('Failed to set extensionData:', error);
                return false
            });
    });

    /**
     * Listen for updates being sent to the background script.
     * Get the active tab and forward the update to the content script.
     */
    extensionMessenger.onMessage('sendToBackground', async (message) => {
        const activeTabs = await browser.tabs.query({ active: true });
        return await extensionMessenger.sendMessage('sendToContent', message.data, activeTabs[0]?.id)
            .then(() => true)
            .catch((error) => {
                console.debug(error);
                return false;
            });
    });

    /**
     * whenever the active tab is changed, send a request to get that tabs session 
     * storage and update the extension data.
     */
    browser.tabs.onActivated.addListener(async (activeInfo) => {
        console.log(activeInfo);
        return await extensionMessenger.sendMessage('requestUpdate', undefined, activeInfo.tabId)
            .then(() => true)
            .catch((error) => {
                console.debug(error);
                return false;
            });
    })
});