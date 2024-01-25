import { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import { StorageDataProvider } from '../providers/StorageDataProvider';
import { publishEvent } from '../utils/CustomEvents';
import {
	Action,
	IChromeMessage,
	IMessageResponse,
	Sender,
	TVersionData,
} from '../types/types';
import { chromeApi } from '../utils/ChromeUtils';
import { useTheme } from '../providers/useTheme';
import Control from '../components/Control/Control';
import ViewGrid from '../components/ViewGrid/ViewGrid';
import DropdownMenu from '../components/DropdownMenu/DropdownMenu';
import { errorToast, promptToast, successToast } from '../utils/Utils';

const Popup = () => {
	const { styles } = useTheme();
	const [data, setData] = useState<object>({});
	const [versionData, setVersionData] = useState<TVersionData>({});

	const fillSessionStorageCallback = () => {
		console.log('sending fill session storage message...');
		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Update,
				message: null,
			} as IChromeMessage,
			async (res: IMessageResponse) => {
				if (!chrome?.storage) {
					errorToast('503', 'Chrome Storage API is not available.');
					return;
				}

				await chrome.storage.local.set({ data: res.data });
				successToast(null, 'Session Storage filled.');
			}
		);

		return;
	};

	const cleanSessionStorageCallback = () => {
		const filteredKeys = Object.keys(data).filter((key) => {
			return !key.startsWith('@utility-fill-');
		});

		const cleanedData = filteredKeys.reduce((acc: any, key: string) => {
			acc[key] = (data as any)[key];
			return acc;
		}, {});

		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Update,
				message: cleanedData,
			} as IChromeMessage,
			async (res: IMessageResponse) => {
				if (!chrome?.storage) {
					errorToast('503', 'Chrome Storage API is not available.');
					return;
				}

				await chrome.storage.local.set({ data: res.data });
				successToast(null, 'Session Storage Data Cleaned.');
			}
		);

		return;
	};

	const clearSessionStorageCallback = () => {
		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Update,
				message: {},
			} as IChromeMessage,
			async (res: IMessageResponse) => {
				if (!chrome?.storage) {
					errorToast('503', 'Chrome Storage API is not available.');
					return;
				}

				await chrome.storage.local.set({ data: res.data });
				successToast(null, 'Session Storage Data Cleared.');
			}
		);
	};

	useEffect(() => {
		// get session storage data
		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Request,
				message: undefined,
			} as IChromeMessage,
			async (res: IMessageResponse) => {
				if (!chrome?.storage) {
					errorToast('503', 'Chrome Storage API is not available.');
					return;
				}

				await chrome.storage.local.set({ data: res.data });
				setData(res.data);
			}
		);

		// check release version
		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Check,
				message: {
					timestamp: new Date().getTime(),
				},
			} as IChromeMessage,
			async (res: IMessageResponse) => {
				if (!chrome?.storage) {
					errorToast('503', 'Chrome Storage API is not available.');
					return;
				}

				await chrome.storage.sync.set({
					versionData: res.data,
				});
				setVersionData(res.data as TVersionData);
			}
		);
	}, []);

	useEffect(() => {
		if (!chrome?.storage) {
			errorToast('503', 'Chrome Storage API is not available.');
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
					<DropdownMenu
						label={'Utitlies'}
						options={[
							{
								label: 'Fill Storage',
								onClickCallback: () => {
									promptToast(
										'utility',
										'Are you sure you want to fill all session storage memory?',
										fillSessionStorageCallback
									);
								},
							},
							{
								label: 'Clear Storage',
								onClickCallback: () => {
									promptToast(
										'utility',
										'Are you sure you want to clear all session storage memory?',
										clearSessionStorageCallback
									);
								},
							},
							{
								label: 'Clean Storage',
								onClickCallback: () => {
									promptToast(
										'utility',
										'Are you sure you want to clean all session storage memory?',
										cleanSessionStorageCallback
									);
								},
							},
						]}
					/>
				</div>
			</div>
			<StorageDataProvider dataObject={data}>
				<ViewGrid />
			</StorageDataProvider>
			<div className={'flex m-1 justify-start text-[var(--borderColor)]'}>
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
