import { useEffect, useState } from 'react';
import Button from '../components/Button/Button';
import Header from '../components/Header/Header';
import List from '../components/List';
import ViewGrid from '../components/ViewGrid';
import { StorageDataProvider } from '../providers/useStorageData';
import { publishEvent } from '../utils/CustomEvents';
import {
	Action,
	IChromeMessage,
	IMessageResponse,
	Sender,
} from '../types/types';
import { getCurrentTabUId } from '../utils/Chrome-Utils';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useTheme } from '../providers/useTheme';

const Popup = () => {
	const { styles } = useTheme();
	const [data, setData] = useState<Object>({});

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
		// request the session storage data
		const message: IChromeMessage = {
			from: Sender.Extension,
			action: Action.Request,
			message: undefined,
		};

		getCurrentTabUId((id) => {
			id &&
				chrome.tabs.sendMessage(
					id,
					message,
					async (res: IMessageResponse) => {
						if (res.error) {
							handleNotification(res.error, 'error');
						}

						if (res.data) {
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
				versionNumber={process.env.VERSION as string}
				link={optionsLink}
			/>
			<Button onClickCallback={() => publishEvent('copyEvent', {})}>
				Copy
			</Button>
			<Button onClickCallback={() => publishEvent('pasteEvent', {})}>
				Paste
			</Button>
			<List bullet={'dash'}>
				<li>
					{
						'Use the checkboxes to include or exclude the corresponding session storage object/item.'
					}
				</li>
				<li>
					{
						'Expand/Close the JSON items in the viewing area to the left by clicking them.'
					}
				</li>
			</List>
			<span>
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
			</span>
			<StorageDataProvider dataObject={data}>
				<ViewGrid />
			</StorageDataProvider>
		</>
	);
};

export default Popup;
