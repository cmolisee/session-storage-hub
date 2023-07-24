import { PropsWithChildren, useState } from "react";
import { getDataType } from "../../utils/Json-Utils";

interface IDataItemProps {
    id: string;
    isExpanded: boolean;
    key?: string;
}

const DataItem = ({
    id,
    isExpanded,
    key,
    children,
}: PropsWithChildren<IDataItemProps>) => {
    const [isOpen, setIsOpen] = useState(isExpanded);
    const dataType = getDataType(children);

    console.log('dataItem id: ', key);
    console.log('dataItem isExpanded: ', isExpanded);
    console.log('dataItem key: ', key);

    return (
        <div className={`DataItem`} id={id}>
            {key && (
                <div className={`DataItem__key`} onClick={() => setIsOpen(!isOpen)} is-open={isOpen}>
                    {key}
                </div>
            )}
            {isOpen && (
                <div className={`DataItem__value DataItem__${dataType}`}>
                    {children}
                </div>
            )}
        </div>
    )
}

export default DataItem;