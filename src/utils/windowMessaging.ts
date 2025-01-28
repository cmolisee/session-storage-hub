import { defineWindowMessaging } from "@webext-core/messaging/page";

/** Protocol for window messaging. */
export interface WebsiteMessengerSchema {
    updateToExtension(data: any): boolean;
    updateFromExtension(data: any): boolean;
    getUpdate(): boolean; // respond to request to update the session data (i.e. new active tab)
};

/** 
 * Window Messenger.
 * Communication between content script and injected script.
 */
export const windowMessenger = defineWindowMessaging<WebsiteMessengerSchema>({
    namespace: MESSAGE_NAMESPACES.WEBPAGE,
});