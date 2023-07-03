import { PropsWithChildren } from "react";
import './ViewGridValue.scss';

interface IViewGridValueProps {
    className?: string;
}

const ViewGridValue = ({
    className,
    children,
}: PropsWithChildren<IViewGridValueProps>) => {
    return (
        <div className={'ViewGridValue'}>
            {children}
        </div>
    );
}

export default ViewGridValue;