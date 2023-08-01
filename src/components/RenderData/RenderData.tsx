import { getDataType } from '../../utils/Json-Utils';
import DataItem from '../DataItem';

interface IRenderDataProps {
	data: any;
	isOpen?: boolean;
}

const renderObject = (data: object, isOpen: boolean = false) => {
	const dataEntries = Object.entries(data);

	if (dataEntries.length) {
		return (
			<>
				{dataEntries.map((entry, i) => {
					return (
						<DataItem
							dataKey={entry[0]}
							isOpen={isOpen}
						>
							<RenderData
								key={i}
								data={entry[1]}
							/>
						</DataItem>
					);
				})}
			</>
		);
	}

	return (
		<DataItem
			dataId={'emptyObject'}
			isOpen={true}
		>
			{'Empty Object'}
		</DataItem>
	);
};

const renderArray = (data: any[], isOpen: boolean = false) => {
	const buildKeyString = (arr: any[]) => {
		const key = JSON.stringify(arr).replace(/^\[(.+)\]$/, '$1');

		if (key.length > 20) {
			const formatted = key.substring(0, 20);
			const lastComma = formatted.lastIndexOf(',');
			return `[${
				lastComma > 0 ? formatted.substring(0, lastComma) : formatted
			},...]`;
		}

		return `[${key}]`;
	};

	if (data.length) {
		return (
			<DataItem
				dataKey={buildKeyString(data)}
				isOpen={isOpen}
			>
				{data.map((arrayData, i) => (
					<RenderData
						key={i}
						data={arrayData}
					/>
				))}
			</DataItem>
		);
	}

	return (
		<DataItem
			dataId={'emptyArray'}
			isOpen={true}
		>
			{'Empty Array'}
		</DataItem>
	);
};

const RenderData = ({ data, isOpen = false }: IRenderDataProps) => {
	const dataType = getDataType(data);

	if (dataType === 'object') {
		return renderObject(data, isOpen);
	} else if (dataType === 'array') {
		return renderArray(data, isOpen);
	}

	return <DataItem isOpen={true}>{data}</DataItem>;
};

export default RenderData;
