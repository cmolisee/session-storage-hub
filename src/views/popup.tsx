import { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import { StorageDataProvider } from '../providers/useStorageData';
import { publishEvent } from '../utils/CustomEvents';
import {
	Action,
	IChromeMessage,
	IMessageResponse,
	Sender,
	TVersionData,
} from '../types/types';
import { getCurrentTabUId } from '../utils/ChromeUtils';
import { toast } from 'react-toastify';
import { useTheme } from '../providers/useTheme';
import Control from '../components/Control/Control';
import ViewGrid from '../components/ViewGrid/ViewGrid';
import DropdownMenu from '../components/DropdownMenu/DropdownMenu';

const Popup = () => {
	const { styles } = useTheme();
	const [data, setData] = useState<object>({});
	const [versionData, setVersionData] = useState<TVersionData>({});

	const handleNotification = (
		message: string,
		type: 'error' | 'info' | 'success'
	) => {
		toast.dismiss();
		toast(message, { type: type });
	};

	useEffect(() => {
		getCurrentTabUId((id) => {
			if (!id) {
				return;
			}
			// get session storage data
			chrome.tabs.sendMessage(
				id,
				{
					from: Sender.Extension,
					action: Action.Request,
					message: undefined,
				} as IChromeMessage,
				async (res: IMessageResponse) => {
					if (chrome.runtime.lastError) {
						handleNotification(
							'Cannot establish connection on this page...',
							'error'
						);
						return;
					}

					if (res && res.error) {
						handleNotification(res.error, 'error');
						return;
					}

					if (res && res.data && chrome?.storage) {
						await chrome.storage.local.set({ data: res.data });
						setData(res.data);
					} else {
						handleNotification(
							'There was an error requesting Session Storage Data.',
							'error'
						);
					}

					return;
				}
			);

			// check release version
			chrome.tabs.sendMessage(
				id,
				{
					from: Sender.Extension,
					action: Action.Check,
					message: {
						timestamp: new Date().getTime(),
					},
				} as IChromeMessage,
				async (res: IMessageResponse) => {
					if (chrome.runtime.lastError) {
						handleNotification(
							'Cannot establish connection on this page...',
							'error'
						);
						return;
					}

					if (res && res.error) {
						handleNotification(res.error, 'error');
						return;
					}

					if (res && res.data && chrome?.storage) {
						await chrome.storage.sync.set({
							versionData: res.data,
						});
						setVersionData(res.data as TVersionData);
					} else {
						handleNotification(
							'There was an error retrieving the latest release information.',
							'error'
						);
					}

					return;
				}
			);
		});
	}, []);

	useEffect(() => {
		if (!chrome?.storage) {
			handleNotification('Chrome api is not available.', 'error');
			return;
		}

		chrome.storage.onChanged.addListener(function (changes, areaName) {
			if (
				areaName === 'local' &&
				!changes.clipboard &&
				!changes.settings
			) {
				const updated = Object.assign({}, data);

				Object.keys(changes).forEach((key) => {
					if (key !== 'clipboard') {
						const updateObject = changes[key].newValue;
						Object.assign(updated, updateObject);
					}
				});

				setData(updated);
			}

			if (areaName === 'sync' && changes.options?.newValue) {
				// placeholder in case we need an update on sync storage change for options
			}
		});
	}, []);

	useEffect(() => {
		const html = document.documentElement;
		Object.entries(styles).forEach((s) => {
			return html.style.setProperty(s[0], s[1]);
		});
	}, [styles]);

	return (
		<>
			<Header viewLink={'options'} />
			<div className={'flex justify-between text-[var(--borderColor)]'}>
				<div>
					<Control
						onClickCallback={() => {
							return publishEvent('selectAllEvent', {});
						}}>
						Select All
					</Control>
					<Control
						onClickCallback={() => {
							return publishEvent('unselectAllEvent', {});
						}}>
						Unselect All
					</Control>
				</div>
				<div>
					<Control
						className={'font-bold'}
						onClickCallback={() => {
							return publishEvent('copyEvent', {});
						}}>
						Copy
					</Control>
					<Control
						className={'font-bold'}
						onClickCallback={() => {
							return publishEvent('pasteEvent', {});
						}}>
						Paste
					</Control>
				</div>
				<div>
					{/* <Control
						className={'font-bold'}
						onClickCallback={() => {
							console.log('this should show a popup to confirm...');
							console.log('fill storage...');
						}}>
						Fill Storage
					</Control>
					<Control
						className={'font-bold'}
						onClickCallback={() => {
							console.log('this should show a popup to confirm...');
							console.log('empty storage...');
						}}>
						Clear Storage
					</Control> */}
					<DropdownMenu 
						label={'Utitlies'}
						options={[
							{
								label: 'Fill Storage',
								onClickCallback: () => {
									console.log('should show popup to confirm...');
									console.log('fill storage...');
								}
							},
							{
								label: 'Clear Storage',
								onClickCallback: () => {
									console.log('should show popup to confirm...');
									console.log('empty storage...');
								}
							},
							{
								label: 'Clean Storage',
								onClickCallback: () => {
									console.log('should show popup to confirm...');
									console.log('cleaning utility objects from storage...');
								}
							}
						]} />			
				</div>
			</div>
			<StorageDataProvider dataObject={data}>
				<ViewGrid />
			</StorageDataProvider>
			<div className={'flex m-1 justify-end text-[var(--borderColor)]'}>
				<div className={'cursor-default mr-4'}>
					version {(VERSION as string) ?? 'UNKNOWN'}
				</div>
				{versionData &&
					!versionData.isUpToDate &&
					versionData.releaseUrl && (
						<Control
							onClickCallback={() => {
								if (versionData.releaseUrl) {
									window.location.href =
										versionData.releaseUrl as string;
								}
							}}>
							New version available
						</Control>
					)}
			</div>
		</>
	);
};

export default Popup;
