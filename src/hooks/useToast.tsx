import { ToastOptions, toast } from "react-toastify";
import Control from "../components/Control/Control";

export interface IUseToastProps {
    toastOps?: ToastOptions,
    message: React.ReactNode,
    acceptText?: string;
    declineText?: string;
    acceptCallback?: () => void;
    declineCallback?: () => void;
}

interface IMsgProps { 
    closeToast?: () => void,
    content: IUseToastProps
}

const Msg = ({
    closeToast,
    content
}: IMsgProps) => {

    return (
        <div>
            <div className={'ToastMsg w-full text-center'}>
                {content?.message}
            </div>
            {(content.acceptText || content.declineText) && (
                <div className={'ToastBtns flex justify-center'}>
                {content?.acceptText && (
                    <Control onClickCallback={content?.acceptCallback}>
                        {content?.acceptText}
                    </Control>
                )}
                {content?.declineText && (
                    <Control onClickCallback={content?.declineCallback ?? closeToast}>
                        {content?.declineText}
                    </Control>
                )}
            </div>
            )}
        </div>
    )
}

export function useToast(props: IUseToastProps) {
    toast(<Msg content={props}/>, {...props.toastOps});
}