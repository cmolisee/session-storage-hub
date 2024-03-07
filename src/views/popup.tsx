import { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import { StorageDataProvider } from '../providers/dataProvider';
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
	const [versionData, setVersionData] = useState<TVersionData>();
	const [sessionStorageData, setSessionStorageData] = useState({});

	const fillSessionStorageCallback = () => {
		chromeApi(
			{
				from: Sender.Extension,
				action: Action.FillStorage,
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

	const cleanSessionStorageCallback = useCallback(() => {
		const filteredKeys = Object.keys(sessionStorageData).filter((key) => {
			return !key.startsWith('@utility-fill-');
		});

		const cleanedData = filteredKeys.reduce((acc: any, key: string) => {
			acc[key] = (sessionStorageData as any)[key];
			return acc;
		}, {});

		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Update,
				message: { updatedData: cleanedData },
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
	}, [sessionStorageData]);

	const clearSessionStorageCallback = () => {
		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Update,
				message: { updatedData: {} },
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

	// request session storage from browser
	useEffect(() => {
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
			}
		);
	}, []);

	// request latest version from repo
	useEffect(() => {
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

				await chrome.storage.sync.set({ versionData: res.data });
			}
		);
	}, []);

	// setup change listener for chrome storage
	useEffect(() => {
		if (!chrome?.storage) {
			errorToast('503', 'Chrome Storage API is not available.');
			return;
		}

		function localStorageChangeListener(changes: any, areaName: any) {
			if (
				areaName === 'local' &&
				!changes.clipboard &&
				!changes.settings
			) {
				setSessionStorageData(JSON.parse(JSON.stringify(changes.data.newValue)));
			}
		}

		function syncStorageChangeListener(changes: any, areaName: any) {
			if (areaName === 'sync' && changes.versionData) {
				setVersionData(changes.versionData);
			}
		}

		chrome.storage.onChanged.addListener(localStorageChangeListener);
		chrome.storage.onChanged.addListener(syncStorageChangeListener);

		return () => {
			chrome.storage.onChanged.removeListener(localStorageChangeListener);
			chrome.storage.onChanged.removeListener(syncStorageChangeListener);
		};
	}, [setSessionStorageData]);

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
			<StorageDataProvider data={sessionStorageData}>
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
