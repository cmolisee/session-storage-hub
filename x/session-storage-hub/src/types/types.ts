export enum Sender {
	Webpage,
	Extension,
}

export enum Action {
	Request,
	Update,
	Post,
	Check,
}

export interface IChromeMessage {
	from: Sender;
	action: Action;
	message: any;
}

export interface IMessageResponse {
	error: string | null;
	data: any;
}

export type TVersionData = {
	isUpToDate?: boolean;
	timestamp?: number;
	releaseUrl?: string;
};
