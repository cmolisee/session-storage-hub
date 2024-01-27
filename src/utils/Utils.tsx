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

export function createToast(props: IUseToastProps) {
	toast(<Msg content={props} />, { ...props.toastOps });
}

const toastOptions = {
	autoClose: 2000,
	closeOnClick: true,
	pauseOnHover: true,
};

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

export function getDataAsFormattedJson(object: any) {
	try {
		return JSON.parse(object);
	} catch {
		return object;
	}
}

export function getDataType(data: any): TDataTypes {
	if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
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

export function areDeeplyEqual(obj1: any, obj2: any) {
  	if (obj1 === obj2) {
		return true;
  	}

	const type1 = Array.isArray(obj1) ? 'array' : 'object';
	const type2 = Array.isArray(obj2) ? 'array' : 'object';

	if (type1 === 'array' && type2 === 'array') {
		if (obj1.length !== obj2.length) {
			return false;
		}

		return obj1.every((elem: any, index: number) => {
			return areDeeplyEqual(elem, obj2[index]);
		});
	} else if (type1 === 'object' && type2 === 'object') {
		if (obj1 === null && obj2 === null) {
			return true;
		}

		const keys1 = Object.keys(obj1)
		const keys2 = Object.keys(obj2)

		if (keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key))) {
			return false;
		}
		
		for(let key in obj1) {
			let isEqual = areDeeplyEqual(obj1[key], obj2[key])
			if (!isEqual) { 
				return false; 
			}
		}

		return true;
	}

	return false;
}