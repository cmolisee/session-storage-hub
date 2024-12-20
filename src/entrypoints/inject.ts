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

    const sessionDataUpdateToExtension = (e: any) => {
        windowMessenger.sendMessage('updateToExtension', deepCopy(e.storageArea))
            .catch((error) => console.debug(error));
    };

    window.removeEventListener('storage', sessionDataUpdateToExtension);

    window.addEventListener('storage', sessionDataUpdateToExtension);
})