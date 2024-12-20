import { defineExtensionMessaging } from "@webext-core/messaging";

/** Protocol for extension messages */
interface ProtocolMap {
    sendToBackground(data: any): boolean // send session data to the background script
    sendToContent(data: any): boolean // send session data from background to content script
    updateFromPage(data: any): boolean // receive session data update from content script
}

/** 
 * Extension messenger.
 * Communication between extension, background script, and content script.
 */
export const extensionMessenger = defineExtensionMessaging<ProtocolMap>();