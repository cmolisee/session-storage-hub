import { PropsWithChildren, useState } from "react";
import { getDataType } from "../../utils/Json-Utils";

interface IDataItemProps {
    dataId: string;
    isOpen: boolean;
    dataKey?: string;
}

const DataItem = ({
    dataId,
    isOpen,
    dataKey,
    children,
}: PropsWithChildren<IDataItemProps>) => {
    const [showData, setShowData] = useState(isOpen || !dataKey);
    const dataType = getDataType(children);

    console.log('dataItem id: ', dataId);
    console.log('dataItem isExpanded: ', showData);
    console.log('dataItem key: ', dataKey);

    return (
        <div className={`DataItem`} id={dataId}>
            {dataKey && (
                <div className={`DataItem__key`} onClick={() => setShowData(!showData)} show-data={showData}>
                    {dataKey}
                </div>
            )}
            {showData && (
                <div className={`DataItem__value DataItem__${dataType}`}>
                    {children}
                </div>
            )}
        </div>
    )
}

export default DataItem;