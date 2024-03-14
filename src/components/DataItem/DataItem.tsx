import { PropsWithChildren, useEffect, useState } from 'react';
import { getDataType } from '../../utils/JsonUtils';
import { CaretDownFilled, CaretRightFilled } from '@ant-design/icons';
import './DataItem.css';

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
	const value = (() => {
		switch (dataType) {
			case 'undefined':
				return 'undefined';
			case 'null':
				return 'Null';
			case 'boolean':
				return String(children);
			default:
				return children;
		}
	})();

	useEffect(() => {
		setShowData(isOpen || !dataKey);
	}, [isOpen, dataKey]);

	return (
		<div
			className={'DataItem flex flex-col'}
			id={dataId as string}>
			{dataKey && (
				<div
					className={'cursor-pointer text-[var(--objectColor)]'}
					onClick={() => {
						return setShowData(!showData);
					}}
					show-data={showData.toString()}>
					<span className={'text-xs pr-0.5'}>
						{showData ? <CaretDownFilled /> : <CaretRightFilled />}
					</span>
					{dataKey}
				</div>
			)}
			{showData && <div className={`DataItem__${dataType}`}>{value}</div>}
		</div>
	);
};

export default DataItem;
