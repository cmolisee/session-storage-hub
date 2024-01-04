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

export const createToast = (props: IUseToastProps) => {
	toast(<Msg content={props} />, { ...props.toastOps });
};
