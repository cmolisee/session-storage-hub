import './ViewGrid.css';
import { useStorageData } from '../../providers/StorageDataProvider';
import { useEffect } from 'react';
import { publishEvent, subscribe, unsubscribe } from '../../utils/CustomEvents';
import ViewGridKey from '../ViewGridKey/ViewGridKey';
import ViewGridValue from '../ViewGridValue/ViewGridValue';
import { errorToast, infoToast } from '../../utils/Utils';
import Control from '../Control/Control';

interface IViewGridProps {
	className?: string;
}

const ViewGrid = ({ className }: IViewGridProps) => {
	const {
		data,
		isEditing,
		keys,
		selectedKeys,
		setDataKey,
		selectAll,
		unselectAll,
	} = useStorageData();

	const handleCopy = async () => {
		console.log('calling handle copy...')
		if (!chrome?.storage) {
			console.log('chrome error...')
			errorToast('503', 'Chrome Storage API is not available.');
			return;
		}

		const dataToCopy = {};
		Object.entries(data).forEach((e) => {
			if (selectedKeys.indexOf(e[0]) >= 0) {
				Object.defineProperty(dataToCopy, e[0] as keyof typeof data, {
					value: e[1],
				});
			}
		});

		await chrome.storage.local.set({ clipboard: dataToCopy }, () => {
			if (chrome.runtime.lastError) {
				errorToast('runtime.lastError', 'error setting clipboard data...');
			}
		});

		infoToast(null, 'Session Storage Data Coppied.');
	};

	const handlePaste = async () => {
		if (!chrome?.storage) {
			errorToast('runtime.lastError', 'Chrome Storage API is not available.');
			return;
		}

		console.log(chrome.storage.local);

		chrome.storage.local.get(['clipboard', 'MarketingAttributes'], (res) => {
			console.log(res);
			// chromeApi(
			// 	{
			// 		from: Sender.Extension,
			// 		action: Action.Update,
			// 		message: { updateData: res. },
			// 	} as IChromeMessage,
			// 	async (res: IMessageResponse) => {
			// 		if (!chrome?.storage) {
			// 			errorToast('503', 'Chrome Storage API is not available.');
			// 			return;
			// 		}

			// 		await chrome.storage.local.set({ data: res.data });
			// 		successToast(null, 'Session Storage Data Pasted.');
			// 	}
			// );
		});	
	};

	const handleSaveCallback = () => {
		publishEvent('SaveEdits', {});
	};

	const handleCancelCallback = () => {
		publishEvent('CancelEdits', {});
	};

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
	}, [data]);

	return (
		<>
			<div className={`ViewGrid ${className ?? ''}`}>
				<div className={'ViewGrid__30'}>
					{keys &&
						keys.map((key, i) => {
							return (
								<ViewGridKey
									key={i}
									keyName={key}
									callback={() => {
										setDataKey(key);
									}}
								/>
							);
						})}
				</div>
				<div className={'ViewGrid__70'}>
					<ViewGridValue />
				</div>
			</div>
			{isEditing && (
				<div
					className={
						'absolute right-0 font-bold text-[var(--borderColor)]'
					}>
					<Control
						className={'hover:text-green-300'}
						onClickCallback={handleSaveCallback}>
						Submit Edits
					</Control>
					<Control
						className={'hover:text-red-300 bold'}
						onClickCallback={handleCancelCallback}>
						Cancel Edits
					</Control>
				</div>
			)}
		</>
	);
};

export default ViewGrid;
