import './ViewGrid.css';
import { useStorageData } from '../../providers/useStorageData';
import { useCallback, useEffect } from 'react';
import { subscribe, unsubscribe } from '../../utils/CustomEvents';
import {
	Action,
	IChromeMessage,
	IMessageResponse,
	Sender,
} from '../../types/types';
import { getCurrentTabUId } from '../../utils/ChromeUtils';
import { toast } from 'react-toastify';
import ViewGridKey from '../ViewGridKey/ViewGridKey';
import ViewGridValue from '../ViewGridValue/ViewGridValue';

interface IViewGridProps {
	className?: string;
}

const ViewGrid = ({ className }: IViewGridProps) => {
	const { data, keys, selectedKeys, setDataKey, selectAll, unselectAll } =
		useStorageData();

	const handleNotification = (
		message: string,
		type: 'error' | 'info' | 'success'
	) => {
		toast.dismiss();
		toast(message, { type: type });
	};

	const handleCopy = useCallback(async () => {
		const clipboard = {};
		Object.entries(data).forEach((e) => {
			if (selectedKeys.indexOf(e[0]) >= 0) {
				Object.defineProperty(clipboard, e[0] as keyof typeof data, {
					value: e[1],
				});
			}
		});

		await chrome.storage.local.set({ clipboard: clipboard });
		handleNotification('Session Storage Coppied.', 'info');
	}, [data, selectedKeys]);

	const handlePaste = useCallback(async () => {
		const clipboard = await chrome.storage.local.get(['clipboard']);
		const message: IChromeMessage = {
			from: Sender.Extension,
			action: Action.Update,
			message: clipboard,
		};

		getCurrentTabUId((id) => {
			id &&
				chrome.tabs.sendMessage(
					id,
					message,
					async (res: IMessageResponse) => {
						if (chrome.runtime.lastError) {
							handleNotification(
								'Cannot establish connection on this page...',
								'error'
							);
							return;
						}

						if (res.error) {
							handleNotification(res.error, 'error');
							return;
						}

						if (res.data) {
							await chrome.storage.local.set({ data: res.data });
							handleNotification(
								'Session Storage Pasted.',
								'success'
							);
							return;
						}
					}
				);
		});
	}, [data, selectedKeys]);

	useEffect(() => {
		subscribe('selectAllEvent', selectAll);
		subscribe('unselectAllEvent', unselectAll);
		subscribe('copyEvent', handleCopy);
		subscribe('pasteEvent', handlePaste);

		return () => {
			unsubscribe('selectAllEvent', selectAll);
			unsubscribe('unselectAllEvent', unselectAll);
			unsubscribe('copyEvent', handleCopy);
			unsubscribe('pasteEvent', handlePaste);
		};
	}, [data, selectedKeys]);

	return (
		<div className={`ViewGrid ${className ?? ''}`}>
			<div className={'ViewGrid__30'}>
				{keys &&
					keys.map((key, i) => {
						return (
							<ViewGridKey
								key={i}
								keyName={key}
								callback={() => {
									return setDataKey && setDataKey(key);
								}}
							/>
						);
					})}
			</div>
			<div className={'ViewGrid__70'}>
				<ViewGridValue />
			</div>
		</div>
	);
};

export default ViewGrid;
