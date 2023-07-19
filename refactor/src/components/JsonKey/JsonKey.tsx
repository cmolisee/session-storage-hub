import { MouseEvent, PropsWithChildren } from "react";
import './JsonKey.scss';

interface IJsonKeyProps {
    className?: string;
    onClickCallback?: (e: MouseEvent<HTMLDivElement>) => void;
}

const JsonKey = ({
    className,
    children,
    onClickCallback = () => {},
}: PropsWithChildren<IJsonKeyProps>) => {
    return (
        <div className={`JsonKey ${className as string}`} onClick={onClickCallback!}>
            {children}
        </div>
    );
};

export default JsonKey;