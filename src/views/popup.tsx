import { useEffect, useState } from 'react';
import Button from '../components/Button/Button';
import Header from '../components/Header/Header';
import ViewGrid from '../components/ViewGrid';
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
import { Link } from 'react-router-dom';
import { useTheme } from '../providers/useTheme';

const Popup = () => {
	const { styles } = useTheme();
	const [data, setData] = useState<Object>({});
	const [versionData, setVersionData] = useState<TVersionData>({});

	const handleNotification = (
		message: string,
		type: 'error' | 'info' | 'success'
	) => {
		toast.dismiss();
		toast(message, { type: type });
	};

	const optionsLink = (
		<Link
			style={{ textDecoration: 'none' }}
			className={'Button Button__link'}
			to={'/options'}
		>
			Options
		</Link>
	);

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
					if (res && res.error) {
						handleNotification(res.error, 'error');
					}

					if (res && res.data) {
						await chrome.storage.local.set({ data: res.data });
						setData(res.data);
					} else {
						handleNotification(
							'There was an error requesting Session Storage Data.',
							'error'
						);
					}
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
					if (res && res.error) {
						handleNotification(res.error, 'error');
					}

					if (res && res.data) {
						await chrome.storage.local.set({
							versionData: res.data,
						});
						setVersionData(res.data as TVersionData);
					} else {
						handleNotification(
							'There was an error retrieving the latest release information.',
							'error'
						);
					}
				}
			);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		chrome.storage.onChanged.addListener(function (changes, areaName) {
			if (
				areaName === 'local' &&
				!changes.clipboard &&
				!changes.settings
			) {
				let updated = Object.assign({}, data);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const html = document.documentElement;
		Object.entries(styles).forEach((s) =>
			html.style.setProperty(s[0], s[1])
		);
	}, [styles]);

	return (
		<>
			<Header
				title={'Session Storage Hub'}
				link={optionsLink}
				versionNumber={process.env.VERSION as string}
			/>
			<Button onClickCallback={() => publishEvent('copyEvent', {})}>
				Copy
			</Button>
			<Button onClickCallback={() => publishEvent('pasteEvent', {})}>
				Paste
			</Button>
			<div className={'mt-2'}>
				<Button
					version={'link'}
					onClickCallback={() => publishEvent('selectAllEvent', {})}
				>
					Select All
				</Button>
				<Button
					version={'link'}
					onClickCallback={() => publishEvent('unselectAllEvent', {})}
				>
					Unselect All
				</Button>
			</div>
			<StorageDataProvider dataObject={data}>
				<ViewGrid />
			</StorageDataProvider>
			{versionData &&
				!versionData.isUpToDate &&
				versionData.releaseUrl && (
					<div className={'d-flex m-h justify-end'}>
                        <a className={'updateVersion'}
                            href={versionData.releaseUrl}
                            target={'_blank'}
                            rel="noreferrer"
                        >
                            New version available
                        </a>
                    </div>
				)}
		</>
	);
};

export default Popup;
