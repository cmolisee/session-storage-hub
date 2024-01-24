import { useStorageData } from '../../providers/useStorageData';
import { getDataAsFormattedJson } from '../../utils/JsonUtils';
import Editor from '../Editor/Editor';
import './ViewGridValue.css';

interface IViewGridValueProps {}

// eslint-disable-next-line no-empty-pattern
const ViewGridValue = ({}: IViewGridValueProps) => {
	const { dataValue, keys } = useStorageData();
	const data = getDataAsFormattedJson(dataValue);

	if (!keys.length) {
		return <div className={'ViewGridValue'} />;
	}

	return (
		<div className={'ViewGridValue relative'}>
			<Editor>{data}</Editor>
		</div>
	);
};

export default ViewGridValue;
