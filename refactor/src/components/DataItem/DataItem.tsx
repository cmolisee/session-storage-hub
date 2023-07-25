import { PropsWithChildren, useState } from "react";
import { getDataType } from "../../utils/Json-Utils";

interface IDataItemProps {
    dataId: string;
    isExpanded: boolean;
    dataKey?: string;
}

const DataItem = ({
    dataId,
    isExpanded,
    dataKey,
    children,
}: PropsWithChildren<IDataItemProps>) => {
    const [isOpen, setIsOpen] = useState(isExpanded);
    const dataType = getDataType(children);

    console.log('dataItem id: ', dataId);
    console.log('dataItem isExpanded: ', isExpanded);
    console.log('dataItem key: ', dataKey);

    return (
        <div className={`DataItem`} id={dataId}>
            {dataKey && (
                <div className={`DataItem__key`} onClick={() => setIsOpen(!isOpen)} is-open={isOpen}>
                    {dataKey}
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