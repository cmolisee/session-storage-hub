import './ViewGridKey.css';
import { useStorageData } from '../../providers/useStorageData';

interface IViewGridKeyProps {
	keyName: string;
}

const ViewGridKey = ({ keyName }: IViewGridKeyProps) => {
	const { activeKey, setActiveKey, selectedKeys, setSelectedKeys } = useStorageData();

	const handleOnChange = () => {
		if (!selectedKeys.includes(keyName)) {
			setSelectedKeys([...selectedKeys, keyName]);
		} else {
			setSelectedKeys(selectedKeys.filter((k) => { return k !== keyName }));
		}
	}

	const handleSetActiveKey = () => {
		setActiveKey(keyName);
	}

	return (
		<div
			className={'ViewGridKey'}
			aria-selected={activeKey === keyName}>
			<input
				type={'checkbox'}
				checked={selectedKeys.includes(keyName)}
				onChange={handleOnChange}
			/>
			<p onClick={handleSetActiveKey}>{keyName}</p>
		</div>
	);
};

export default ViewGridKey;
