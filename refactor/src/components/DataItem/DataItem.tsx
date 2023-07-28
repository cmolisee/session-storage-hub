import { PropsWithChildren, useEffect, useState } from "react";
import { getDataType } from "../../utils/Json-Utils";
import { CaretDownFilled, CaretRightFilled } from '@ant-design/icons';
import './DataItem.scss';

interface IDataItemProps {
    dataId?: string;
    isOpen: boolean;
    dataKey?: string;
}

const DataItem = ({
    dataId,
    isOpen,
    dataKey,
    children,
}: PropsWithChildren<IDataItemProps>) => {
    const [showData, setShowData] = useState<boolean>(false);
    const dataType = getDataType(children);

    useEffect(() => {
        setShowData(isOpen || !dataKey);
    }, [isOpen, dataKey])

    return (
        <div className={`DataItem`} id={dataId as string}>
            {dataKey && (
                <div className={`DataItem__key`} onClick={() => setShowData(!showData)} show-data={showData}>
                    <span style={{ fontSize: '0.725rem', paddingRight: '0.125rem' }}>{showData ? <CaretDownFilled /> : <CaretRightFilled />}</span>
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