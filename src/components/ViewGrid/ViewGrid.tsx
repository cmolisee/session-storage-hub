import './ViewGrid.css';
import { useData } from '../../providers/dataProvider';
import { useEffect } from 'react';
import { publishEvent, subscribe, unsubscribe } from '../../utils/CustomEvents';
import ViewGridKey from '../ViewGridKey/ViewGridKey';
import ViewGridValue from '../ViewGridValue/ViewGridValue';
import { errorToast, infoToast, successToast } from '../../utils/Utils';
import Control from '../Control/Control';
import { chromeApi } from '../../utils/ChromeUtils';
import { Action, IChromeMessage, IMessageResponse, Sender } from '../../types/types';

interface IViewGridProps {
	className?: string;
}

const ViewGrid = ({ className }: IViewGridProps) => {
	const {
		sessionStorageData,
		isEditing,
		keys,
		selectedKeys,
		setActiveKey,
		selectAllKeys,
		unselectAllKeys,
	} = useData();

	const handleCopy = async () => {
		if (!chrome?.storage) {
			errorToast('503', 'Chrome Storage API is not available.');
			return;
		}

		const dataToCopy = {};
		Object.entries(sessionStorageData).forEach((e) => {
			if (selectedKeys.indexOf(e[0]) >= 0) {
				Object.defineProperty(dataToCopy, e[0], {
					value: e[1],
				});
			}
		});

		await chrome.storage.local.set({ clipboard: dataToCopy }, () => {
			if (chrome.runtime.lastError) {
				errorToast(
					'runtime.lastError',
					'error setting clipboard data...'
				);
			}
		});

		infoToast(null, 'Session Storage Data Coppied.');
	};

	const handlePaste = async () => {
		if (!chrome?.storage) {
			errorToast(
				'runtime.lastError',
				'Chrome Storage API is not available.'
			);
			return;
		}

		chrome.storage.local.get(
			['clipboard', 'MarketingAttributes'],
			(res) => {
				chromeApi(
					{
						from: Sender.Extension,
						action: Action.Update,
						message: { updateData: res.data },
					} as IChromeMessage,
					async (res: IMessageResponse) => {
						if (!chrome?.storage) {
							errorToast('503', 'Chrome Storage API is not available.');
							return;
						}

						await chrome.storage.local.set({ data: res.data });
						successToast(null, 'Session Storage Data Pasted.');
					}
				);
			}
		);
	};

	const handleSaveCallback = () => {
		publishEvent('SaveEdits', {});
	};

	const handleCancelCallback = () => {
		publishEvent('CancelEdits', {});
	};

	useEffect(() => {
		subscribe('selectAllEvent', selectAllKeys);
		subscribe('unselectAllEvent', unselectAllKeys);
		subscribe('copyEvent', handleCopy);
		subscribe('pasteEvent', handlePaste);

		return () => {
			unsubscribe('selectAllEvent', selectAllKeys);
			unsubscribe('unselectAllEvent', unselectAllKeys);
			unsubscribe('copyEvent', handleCopy);
			unsubscribe('pasteEvent', handlePaste);
		};
	}, [sessionStorageData]);

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
										setActiveKey(key);
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
