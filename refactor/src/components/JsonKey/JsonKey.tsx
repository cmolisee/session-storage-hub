import { PropsWithChildren } from "react";
import './JsonKey.scss';

interface IJsonKeyProps {
    className?: string;
}

const JsonKey = ({
    className,
    children,
}: PropsWithChildren<IJsonKeyProps>) => {
    return (
        <div className={`JsonKey ${className as string}`}>
            {children}
        </div>
    );
};

export default JsonKey;