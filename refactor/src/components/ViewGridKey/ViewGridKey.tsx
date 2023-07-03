import { PropsWithChildren, useState } from "react";
import './ViewGridKey.scss';

interface IViewGridKeyProps {
    isSelected?: boolean;
    callback: () => void;
}

const ViewGridKey = ({
    isSelected,
    callback,
    children
}: PropsWithChildren<IViewGridKeyProps>) => {
    const [isChecked, setIsChecked] = useState<boolean>(() => isSelected as boolean);
    
    return (
        <div className={'ViewGridKey'}>
            <input type={'checkbox'} 
                checked={isChecked} 
                onClick={() => setIsChecked(!isChecked)}/>
            <p aria-selected={isSelected} onClick={callback}>
                {children}
            </p>
        </div>
    );
}

export default ViewGridKey;