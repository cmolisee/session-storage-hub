import { deepCopy } from "@/utils/utils";

export default defineUnlistedScript(() => {
    /** Send session data to extension. */
    windowMessenger.sendMessage('updateToExtension', deepCopy(window.sessionStorage))
        .catch((error) => console.debug(error));

    /**
     * Receive session data from extension.
     * Delete storage to avoid stale data.
     * Assign update to session and trigger storage event to
     * cascade changes back to extension.
     */
    windowMessenger.onMessage('updateFromExtension', (message) => {
        sessionStorage.clear();
        Object.assign(sessionStorage, message.data);
        window.dispatchEvent(new StorageEvent('storage', { storageArea: window.sessionStorage }));
        return true;
    });

    /**
     * Receive a request from the background script to update session storage.
     * This request happens on activeTab change.
     * When received, respond by sending an updateToExtension message which
     * will pass the pages session data back to the extension.
     */
    windowMessenger.onMessage('getUpdate', () => {
        windowMessenger.sendMessage('updateToExtension', deepCopy(window.sessionStorage))
            .catch((error) => console.debug(error));
        return true;
    });

    const sessionDataUpdateToExtension = (e: any) => {
        windowMessenger.sendMessage('updateToExtension', deepCopy(e.storageArea))
            .catch((error) => console.debug(error));
        return true;
    };

    window.removeEventListener('storage', sessionDataUpdateToExtension);

    window.addEventListener('storage', sessionDataUpdateToExtension);
})