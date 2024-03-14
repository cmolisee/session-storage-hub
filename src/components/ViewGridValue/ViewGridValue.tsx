import Editor from '../Editor/Editor';
import './ViewGridValue.css';

interface IViewGridValueProps { }

// eslint-disable-next-line no-empty-pattern
const ViewGridValue = ({ }: IViewGridValueProps) => {
	const viewGridStyles = 'ViewGridValue relative overflow-x-hidden';

	return (
		<div className={viewGridStyles}>
			<Editor />
		</div>
	);
};

export default ViewGridValue;
