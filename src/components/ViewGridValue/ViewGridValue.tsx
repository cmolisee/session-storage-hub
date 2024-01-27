import Editor from '../Editor/Editor';
import './ViewGridValue.css';

interface IViewGridValueProps {}

// eslint-disable-next-line no-empty-pattern
const ViewGridValue = ({}: IViewGridValueProps) => {
	

	return (
		<div className={'ViewGridValue relative overflow-x-hidden'}>
			<Editor />
		</div>
	);
};

export default ViewGridValue;
