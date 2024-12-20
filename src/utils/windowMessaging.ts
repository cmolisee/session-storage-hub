import { defineWindowMessaging } from "@webext-core/messaging/page";

/** Protocol for window messaging. */
export interface WebsiteMessengerSchema {
    updateToExtension(data: any): boolean;
    updateFromExtension(data: any): boolean;
};

/** 
 * Window Messenger.
 * Communication between content script and injected script.
 */
export const windowMessenger = defineWindowMessaging<WebsiteMessengerSchema>({
    namespace: MESSAGE_NAMESPACES.WEBPAGE,
});