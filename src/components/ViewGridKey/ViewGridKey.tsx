import './ViewGridKey.css';
import { useStorageData } from '../../providers/useStorageData';
import { useState, FocusEvent, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { chromeApi } from '../../utils/ChromeUtils';
import { Action, IChromeMessage, IMessageResponse, Sender } from '../../types/types';
import { errorToast, infoToast } from '../../utils/Utils';

interface IViewGridKeyProps {
	keyName: string;
}

const ViewGridKey = ({ keyName }: IViewGridKeyProps) => {
	const { activeKey, setActiveKey, selectedKeys, setSelectedKeys } = useStorageData();
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [value, setValue] = useState<string>();

	const handleSelectedChange = () => {
		if (!selectedKeys.includes(keyName)) {
			setSelectedKeys([...selectedKeys, keyName]);
		} else {
			setSelectedKeys(selectedKeys.filter((k) => { return k !== keyName }));
		}
	};

	const handleSetActiveKey = () => {
		setActiveKey(keyName);
	};

	const onDoubleClickHandler = () => {
		setIsEditing(true);
	};

	const handleUpdateKey = (newKey: string) => {
		// if empty, null, or no change
		if (!newKey || newKey === keyName) {
			setIsEditing(false);
			return;
		}

		chromeApi(
			{
				from: Sender.Extension,
				action: Action.UpdateKey,
				message: { newKey: newKey, oldKey: keyName },
			} as IChromeMessage,
			async (res: IMessageResponse) => {
				if (!chrome?.storage) {
					errorToast('503', 'Chrome Storage API is not available.');
					return;
				}

				await chrome.storage.local.set({ 'data': res.data });
				infoToast(null, 'Session Storage key updated from ' + keyName + ' to ' + newKey);
			}
		);

		setIsEditing(false);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		console.log('handleChange', e.target.value)
		setValue(e.target.value);
	};

	const handleOnblur = (e: FocusEvent<HTMLInputElement>) => {
		if (e.target.value) {
			setValue(e.target.value);
			handleUpdateKey(e.target.value);
		} else {
			setValue(e.target.value);
		}
	};

	const handleEnterKey = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			if (e.currentTarget.value) {
				setIsEditing(false);
				handleUpdateKey(e.currentTarget.value);
			} else {
				setValue(keyName);
			}
		}
	};

	useEffect(() => {
		console.log('useEffect', value);
		if (!value) {
			setValue(keyName);
		}
	}, []);

	return (
		<div
			className={'ViewGridKey'}
			// use keyName to maintain styles
			aria-selected={activeKey === keyName}>
			<input
				type={'checkbox'}
				// use keyName to maintain functionality
				checked={selectedKeys.includes(keyName)}
				onChange={handleSelectedChange}
			/>
			<div className={'mx-[0.25rem]'} onDoubleClick={onDoubleClickHandler}>
				{!isEditing ? (
					<p onClick={handleSetActiveKey}>{value}</p>
				) : (
					<input type={'text'}
						autoFocus
						className={'focus-visible:outline-none bg-transparent'}
						value={value}
						onChange={handleChange}
						onBlur={handleOnblur}
						onKeyUp={handleEnterKey} />
				)}
			</div>
		</div>
	);
};

export default ViewGridKey;
