import { toast } from 'react-toastify';
import Control from '../components/Control/Control';
import { IMsgProps, IUseToastProps, TDataTypes } from '../types/types';

const Msg = ({ closeToast, content }: IMsgProps) => {
	return (
		<div>
			<div className={'ToastMsg w-full text-center'}>
				{content?.message}
			</div>
			{(content.acceptText || content.declineText) && (
				<div className={'ToastBtns flex justify-center'}>
					{content?.acceptText && (
						<Control
							onClickCallback={() => {
								content?.acceptCallback &&
									content.acceptCallback();
								closeToast && closeToast();
							}}>
							{content?.acceptText}
						</Control>
					)}
					{content?.declineText && (
						<Control
							onClickCallback={() => {
								content?.declineCallback &&
									content.declineCallback();
								closeToast && closeToast();
							}}>
							{content?.declineText}
						</Control>
					)}
				</div>
			)}
		</div>
	);
};

const toastOptions = {
	autoClose: 2000,
	closeOnClick: true,
	pauseOnHover: true,
};

export function createToast(props: IUseToastProps) {
	toast(<Msg content={props} />, { ...props.toastOps });
}

export function errorToast(id: string | null, msg: string) {
	createToast({
		toastOps: {
			toastId: id ?? undefined,
			type: 'error',
			...toastOptions,
		},
		message: msg,
	});
}

export function infoToast(id: string | null, msg: string) {
	createToast({
		toastOps: {
			toastId: id ?? undefined,
			type: 'info',
			...toastOptions,
		},
		message: msg,
	});
}

export function warningToast(id: string | null, msg: string) {
	createToast({
		toastOps: {
			toastId: id ?? undefined,
			type: 'warning',
			...toastOptions,
		},
		message: msg,
	});
}

export function successToast(id: string | null, msg: string) {
	createToast({
		toastOps: {
			toastId: id ?? undefined,
			type: 'success',
			...toastOptions,
		},
		message: msg,
	});
}

export function promptToast(
	id: string | null,
	msg: string,
	callback: () => void
) {
	createToast({
		toastOps: {
			toastId: id ?? undefined,
			type: 'default',
			autoClose: false,
			closeOnClick: false,
			pauseOnHover: true,
		},
		message: msg,
		acceptText: 'Continue',
		declineText: 'Cancel',
		acceptCallback: callback,
	});
}

export function promptDeleteToast(
	id: string | null,
	msg: JSX.Element,
	callback: () => void
) {
	createToast({
		toastOps: {
			toastId: id ?? undefined,
			type: 'default',
			autoClose: false,
			closeOnClick: false,
			pauseOnHover: true,
		},
		message: msg,
		acceptText: 'Continue',
		declineText: 'Cancel',
		acceptCallback: callback,
	});
}

export function getDataAsFormattedJson(object: any) {
	try {
		return JSON.parse(object);
	} catch {
		return object;
	}
}

export function getDataType(data: any): TDataTypes {
	if (
		typeof data === 'string' ||
		typeof data === 'number' ||
		typeof data === 'boolean'
	) {
		return typeof data as 'string' | 'number' | 'boolean';
	} else if (typeof data === 'object') {
		if (data === null) {
			return 'none';
		}

		return Array.isArray(data) ? 'array' : 'object';
	} else {
		return 'none';
	}
}

export function sortObjectByKeys(obj: any) {
	return Object.keys(obj).sort().reduce((ordered: any, key: string) => {
		ordered[key] = obj[key];
		return ordered;
	}, {});
}
