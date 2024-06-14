import { ToastOptions } from 'react-toastify';

export enum Sender {
	Webpage,
	Extension,
}

export enum Action {
	Request,
	Update,
	Clean,
	Clear,
	Post,
	Check,
	FillStorage,
	Copy,
	Add,
	Delete
}

export enum Themes {
	light = 'light',
	dark = 'dark',
	tokyoNight = 'tokyo-night',
	noctisLight = 'noctis-light',
	bespin = 'bespin',
	andromeda = 'andromeda',
}

export type TDataTypes =
	| 'string'
	| 'number'
	| 'boolean'
	| 'array'
	| 'object'
	| 'none';

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

export interface IUseToastProps {
	toastOps?: ToastOptions;
	message: React.ReactNode;
	acceptText?: string;
	declineText?: string;
	acceptCallback?: () => void;
	declineCallback?: () => void;
}

export interface IMsgProps {
	closeToast?: () => void;
	content: IUseToastProps;
}

export type TFontWeight =
	| 'thin'
	| 'extralight'
	| 'light'
	| 'normal'
	| 'medium'
	| 'semibold'
	| 'bold'
	| 'extrabold'
	| 'black';
export type TFontSize =
	| 'xs'
	| 'sm'
	| 'base'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl';
export type TTextAlign = 'left' | 'center' | 'right';

export interface ITheme {
	name: string;
	colors: IColors;
}

export interface IColors {
	backgroundColor: string;
	textColor: string;
	specialTextColor: string;
	buttonColor: string;
	buttonHoverColor: string;
	borderColor: string;
	selectedIconColor: string;
	unselectedIconColor: string;
	keyColor: string;
	keySelectedColor: string;
}

export interface IThemeStyles {
	'--backgroundColor': string;
	'--textColor': string;
	'--specialTextColor': string;
	'--buttonColor': string;
	'--buttonHoverColor': string;
	'--borderColor': string;
	'--selectedIconColor': string;
	'--unselectedIconColor': string;
	'--keyColor': string;
	'--keySelectedColor': string;
}

export interface IReactToastifyStyles {
	'--toastify-color-info': string;
	'--toastify-color-success': string;
	'--toastify-color-warning': string;
	'--toastify-color-error': string;
	'--toastify-toast-background': string;
	'--toastify-text-color-info': string;
	'--toastify-text-color-success': string;
	'--toastify-text-color-warning': string;
	'--toastify-text-color-error': string;
	// default
	'--toastify-text-color-light': string;
	'--toastify-color-light': string;
}
