import { RefObject, createRef, useCallback, useEffect, useState } from 'react';
import Header from '../components/Header/Header';
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
import { errorToast, infoToast, promptDeleteToast, promptToast, sortObjectByKeys, successToast } from '../utils/Utils';
import { useStorageData } from '../providers/useStorageData';
import Checkbox from '../components/Checkbox/Checkbox';

const Popup = () => {
	const { styles } = useTheme();
	const [versionData, setVersionData] = useState<TVersionData>();
	const { sessionStorageData, setSessionStorageData, selectAllKeys, unselectAllKeys, selectedKeys, keys } = useStorageData();
	const deleteCheckboxRefs: RefObject<HTMLInputElement>[] = keys.map(() => { return createRef<HTMLInputElement>(); });

	const deleteList = () => {
		return (
			<div className={'grid grid-cols-2'}>
				{keys && keys.map((k, i) => {
					return <Checkbox key={i} label={k} ref={deleteCheckboxRefs[i]} />;
				})}
			</div>
		);
	}

	const handleCopy = useCallback(() => {
		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Copy,
				message: { keys: selectedKeys },
			} as IChromeMessage,
			async (res: IMessageResponse) => {
				if (!chrome?.storage) {
					errorToast('503', 'Chrome Storage API is not available.');
					return;
				}

				await chrome.storage.local.set({ 'clipboard': res.data });
				infoToast(null, 'Session Storage Data Coppied.');
			}
		);

		return;
	}, [selectedKeys]);

	const handlePaste = async () => {
		await chrome.storage.local.get(['clipboard'], (res) => {
			chromeApi(
				{
					from: Sender.Extension,
					action: Action.Update,
					message: { updatedData: res.clipboard },
				} as IChromeMessage,
				async (res: IMessageResponse) => {
					if (!chrome?.storage) {
						errorToast('503', 'Chrome Storage API is not available.');
						return;
					}

					await chrome.storage.local.set({ 'data': res.data });
					infoToast(null, 'Session Storage Data Pasted.');
				}
			);
		});

		return;
	}

	const handleAdd = () => {
		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Add,
				message: null,
			} as IChromeMessage,
			async (res: IMessageResponse) => {
				if (!chrome?.storage) {
					errorToast('503', 'Chrome Storage API is not available.');
					return;
				}

				await chrome.storage.local.set({ data: res.data.obj });
				successToast(null, 'Added new Session Storage item: ' + res.data.itemKey);
			}
		);

		return;
	};

	const handleDelete = () => {
		const keysToDelete = deleteCheckboxRefs.reduce((keys: string[], ele: RefObject<HTMLInputElement>) => {
			if (ele.current?.checked) {
				keys.push(ele.current.id);
			}

			return keys;
		}, []);

		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Delete,
				message: { data: keysToDelete },
			} as IChromeMessage,
			async (res: IMessageResponse) => {
				if (!chrome?.storage) {
					errorToast('503', 'Chrome Storage API is not available.');
					return;
				}

				await chrome.storage.local.set({ data: res.data });
				successToast(null, 'Deleted Session Storage keys: ' + keysToDelete.join(', '));
			}
		);
	};

	const handleFillSessionStorageUtility = () => {
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

	const handleCleanSessionStorageUtility = useCallback(() => {
		const cleanedKeys = keys.filter((key) => {
			return !key.startsWith('@utility-fill-');
		});
		const cleanedData = cleanedKeys.reduce((obj: any, key: string) => {
			obj[key] = (sessionStorageData as any)[key];
			return obj;
		}, {});

		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Clean,
				message: { data: cleanedData },
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
	}, [keys]);

	const handleClearSessionStorageUtility = () => {
		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Clear,
				message: null,
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
				await chrome.storage.local.set({ data: sortObjectByKeys(res.data) });
				setSessionStorageData(sortObjectByKeys(res.data));
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
				!changes.settings &&
				changes.data
			) {
				setSessionStorageData(sortObjectByKeys(changes.data.newValue));
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
			<div className={'grid grid-cols-12 text-[var(--borderColor)]'}>
				<div className={'col-span-3 flex justify-between items-end border-[1px] border-r-0 border-b-0 border-[var(--borderColor)]'}>
					<Control
						onClickCallback={selectAllKeys}>
						Select All
					</Control>
					<Control
						onClickCallback={unselectAllKeys}>
						Unselect All
					</Control>
				</div>
				<div className={'col-span-9 flex flex-1 flex-wrap border-[1px] border-b-0 border-[var(--borderColor)]'}>
					<div className={'w-full'}>
						<Control
							onClickCallback={handleCopy}>
							Copy
						</Control>
						<Control
							onClickCallback={handlePaste}>
							Paste
						</Control>
						<Control
							onClickCallback={() => {
								promptToast(
									'utility',
									'Are you sure you want to add a new Item?',
									handleAdd,
								);
							}}>
							Add
						</Control>
						<Control
							onClickCallback={() => {
								promptDeleteToast(
									'utility',
									deleteList(),
									handleDelete,
								);
							}}>
							Delete
						</Control>
					</div>
					<div className={'w-full'}>
						<Control
							onClickCallback={() => {
								promptToast(
									'utility',
									'Caution: This will cause some slowness.\n' +
									'Are you sure you want to fill all session storage memory?',
									handleFillSessionStorageUtility
								);
							}}>
							Fill Storage
						</Control>
						<Control
							onClickCallback={() => {
								promptToast(
									'utility',
									'Are you sure you want to clear all session storage memory?',
									handleClearSessionStorageUtility
								);
							}}>
							Clear Storage
						</Control>
						<Control
							onClickCallback={() => {
								promptToast(
									'utility',
									'Are you sure you want to clean all session storage memory?',
									handleCleanSessionStorageUtility
								);
							}}>
							Clean Storage
						</Control>
					</div>
				</div>
			</div>
			<ViewGrid />
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
