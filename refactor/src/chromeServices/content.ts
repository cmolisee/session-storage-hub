import { Action, IChromeMessage, IMessageResponse, Sender } from "../types/types";

type TResponse = (response?: IMessageResponse) => void

const validateSender = (
    expectedSender: Sender,
    expectedAction: Action,
    message: IChromeMessage,
    sender: chrome.runtime.MessageSender
) => {
    return sender.id === chrome.runtime.id && message.from === expectedSender && message.action === expectedAction;
}

const requestMessageListener = (
    message: IChromeMessage,
    sender: chrome.runtime.MessageSender,
    response: TResponse
) => {
    if (validateSender(Sender.Extension, Action.Request, message, sender)) {
        const data = Object.assign({}, sessionStorage);
        const res = {
            error: !data ? 'Error retrieving session storage' : null,
            data: data
        }

        response(res);
    }
}

const updateMessageListener = (
    message: IChromeMessage,
    sender: chrome.runtime.MessageSender,
    response: TResponse
) => {
    if (validateSender(Sender.Extension, Action.Update, message, sender)) {
        try {
            console.log('updateMessageListener message: ', message);
            Object.entries(message.message?.clipboard ?? {}).forEach((e) => {
                sessionStorage.setItem(e[0], e[1] as string);
            });

            const data = Object.assign({}, sessionStorage);
            response({ error: null, data: data });
        } catch {
            response ({ error: 'Error updating session storage data', data: null })
        }
    }
}

const main = () => {
    // /**
    //  * Fired when a message is sent from either an extension process or a content script.
    //  */
    chrome.runtime.onMessage.addListener(requestMessageListener);
    chrome.runtime.onMessage.addListener(updateMessageListener);
}

main();
