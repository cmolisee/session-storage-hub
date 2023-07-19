import { PropsWithChildren } from "react";
import './JsonValue.scss';

interface IJsonValueProps {
    className?: string;
}

const JsonValue = ({
    className,
    children,
}: PropsWithChildren<IJsonValueProps>) => {
    return (
        <div className={`JsonValue ${className ?? ''}`}>
            {children}
        </div>
    );
}

export default JsonValue;