export enum Sender {
    Webpage,
    Extension
};

export enum Action {
    Request,
    Update,
    Post,
}

export interface IChromeMessage {
    from: Sender,
    action: Action,
    message: any,
}

export interface IMessageResponse {
    error: string | null,
    data: any,
}