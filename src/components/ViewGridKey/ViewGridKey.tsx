import './ViewGridKey.css';
import { useData } from '../../providers/dataProvider';
import { useCallback } from 'react';

interface IViewGridKeyProps {
	keyName: string;
	callback: () => void;
}

const ViewGridKey = ({ keyName, callback }: IViewGridKeyProps) => {
	const { selectedKeys, setSelectedKeys, activeKey } = useData();

	const handleIsChecked = useCallback(() => {
		return selectedKeys?.includes(keyName) ?? false;
	}, [selectedKeys]);

	const handleOnChange = useCallback(() => {
		if (selectedKeys?.includes(keyName)) {
			setSelectedKeys(
				selectedKeys.filter((k) => {
					return k !== keyName;
				})
			);
		} else {
			setSelectedKeys([...(selectedKeys as string[]), keyName]);
		}
	}, [selectedKeys]);

	return (
		<div
			className={'ViewGridKey'}
			aria-selected={activeKey === keyName}>
			<input
				type={'checkbox'}
				checked={handleIsChecked()}
				onChange={handleOnChange}
			/>
			<p onClick={callback}>{keyName}</p>
		</div>
	);
};

export default ViewGridKey;
