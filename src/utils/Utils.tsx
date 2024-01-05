import { toast } from 'react-toastify';
import Control from '../components/Control/Control';
import { IMsgProps, IUseToastProps } from '../types/types';

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
