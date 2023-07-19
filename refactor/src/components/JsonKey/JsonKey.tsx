import { MouseEvent, PropsWithChildren } from "react";
import './JsonKey.scss';

interface IJsonKeyProps {
    className?: string;
    isHidden: boolean;
    onClickCallback?: (e: MouseEvent<HTMLDivElement>) => void;
}

const JsonKey = ({
    className,
    isHidden,
    children,
    onClickCallback = () => {},
}: PropsWithChildren<IJsonKeyProps>) => {
    return (
        <div className={`JsonKey ${className ?? ''}`} onClick={onClickCallback!} is-hidden={String(isHidden)}>
            {children}
        </div>
    );
};

export default JsonKey;