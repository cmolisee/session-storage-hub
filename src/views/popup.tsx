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
import { useTheme } from '../providers/useTheme';
import Control from '../components/Control/Control';
import ViewGrid from '../components/ViewGrid/ViewGrid';
import DropdownMenu from '../components/DropdownMenu/DropdownMenu';
import { createToast } from '../utils/Utils';

const Popup = () => {
	const { styles } = useTheme();
	const [data, setData] = useState<object>({});
	const [versionData, setVersionData] = useState<TVersionData>({});

	function utilityPopupCallback(msg: string, cb: () => void) {
		createToast({
			toastOps: {
				toastId: 'utility',
				type: 'default',
				autoClose: false,
				closeOnClick: false,
				pauseOnHover: true,
			},
			message: msg,
			acceptText: 'Continue',
			declineText: 'Cancel',
			acceptCallback: cb,
		});
	}

	const fillSessionStorageCallback = () => {
		let x = 8;
		console.debug('=== Filling Session Storage ===');
		console.debug('x: ', x);

		while (x > 0) {
			try {
				window.sessionStorage.setItem(
					'@utility-fill-' + window.sessionStorage.length.toString(),
					'@'.repeat(2 ** x)
				);
			} catch (e) {
				x -= 1;
				console.debug('x: ', x);
			}
		}
		return;
	};

	const cleanSessionStorageCallback = () => {
		for (const key of Object.keys(window.sessionStorage)) {
			if (key.startsWith('@utility-fill-')) {
				sessionStorage.removeItem(key);
			}
		}
		return;
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
						createToast({
							toastOps: {
								toastId: '401',
								type: 'error',
								autoClose: 2000,
								closeOnClick: true,
								pauseOnHover: true,
							},
							message:
								'Cannot establish connection on this page.',
						});
						return;
					}

					if (res && res.error) {
						createToast({
							toastOps: {
								toastId: 'SessionStorageComError',
								type: 'error',
								autoClose: 2000,
								closeOnClick: true,
								pauseOnHover: true,
							},
							message: res.error,
						});
						return;
					}

					if (res && res.data && chrome?.storage) {
						await chrome.storage.local.set({ data: res.data });
						setData(res.data);
					} else {
						createToast({
							toastOps: {
								toastId: 'SessionStorageApiError',
								type: 'error',
								autoClose: 2000,
								closeOnClick: true,
								pauseOnHover: true,
							},
							message:
								'There was an error requesting Session Storage Data.',
						});
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
						createToast({
							toastOps: {
								toastId: '401',
								type: 'error',
								autoClose: 2000,
								closeOnClick: true,
								pauseOnHover: true,
							},
							message:
								'Cannot establish connection on this page.',
						});
						return;
					}

					if (res && res.error) {
						createToast({
							toastOps: {
								toastId: 'LatestVersionComError',
								type: 'error',
								autoClose: 2000,
								closeOnClick: true,
								pauseOnHover: true,
							},
							message: res.error,
						});
						return;
					}

					if (res && res.data && chrome?.storage) {
						await chrome.storage.sync.set({
							versionData: res.data,
						});
						setVersionData(res.data as TVersionData);
					} else {
						createToast({
							toastOps: {
								toastId: 'LatestVersionResError',
								type: 'error',
								autoClose: 2000,
								closeOnClick: true,
								pauseOnHover: true,
							},
							message:
								'There was an error retrieving the latest release information.',
						});
					}

					return;
				}
			);
		});
	}, []);

	useEffect(() => {
		if (!chrome?.storage) {
			createToast({
				toastOps: {
					toastId: 'ChromeStorageApiError',
					type: 'error',
					autoClose: 2000,
					closeOnClick: true,
					pauseOnHover: true,
				},
				message: 'Chrome api is not available.',
			});
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
									utilityPopupCallback(
										'Are you sure you want to fill all session storage memory?',
										fillSessionStorageCallback
									);
								},
							},
							{
								label: 'Clear Storage',
								onClickCallback: () => {
									utilityPopupCallback(
										'Are you sure you want to clear all session storage memory?',
										() => {
											window.sessionStorage.clear();
										}
									);
								},
							},
							{
								label: 'Clean Storage',
								onClickCallback: () => {
									utilityPopupCallback(
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
