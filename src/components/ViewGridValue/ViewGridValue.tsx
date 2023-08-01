import { useStorageData } from '../../providers/useStorageData';
import { getDataAsFormattedJson } from '../../utils/Json-Utils';
import DataItem from '../DataItem';
import RenderData from '../RenderData';
import './ViewGridValue.scss';

interface IViewGridValueProps {}

// eslint-disable-next-line no-empty-pattern
const ViewGridValue = ({}: IViewGridValueProps) => {
	const { dataValue, keys } = useStorageData();
	const data = getDataAsFormattedJson(dataValue);

	if (!keys.length) {
		return <div className={`ViewGridValue`} />;
	}

	return (
		<div className={`ViewGridValue`}>
			{data ? <RenderData data={data} /> : <DataItem isOpen={true} />}
		</div>
	);
};

export default ViewGridValue;
