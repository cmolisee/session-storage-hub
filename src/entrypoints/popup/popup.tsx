import Header from '@/components/Header';
import Control from '@/components/control';
import ViewGrid from '@/components/ViewGrid';
import { storage as wxtStorage } from '@wxt-dev/storage';
import Tooltip from '@/components/tooltip';
import { version } from '../../../package.json';
import { Toaster } from 'solid-toast';
import { notification } from '@/utils/utils';

function Popup() {
    const { storage, setSessionStorageData, selectAllKeys, unselectAllKeys } = useStorage();

    const copyCallback = async () => {
        const dataToCopy = deepCopy(storage.sessionStorageData);

        for (const k of Object.keys(dataToCopy)) {
            if (!storage.selectedKeys.includes(k)) {
                delete dataToCopy[k]
            }
        }

        await extensionClipboard.setValue(dataToCopy)
            .then(() => notification('Session Storage Data Copied.'))
            .catch((error) => console.debug('Failed to set extensionClipboard:', error));
    }

    const pasteCallback = async () => {
        const dataToPaste = await extensionClipboard.getValue()
            .then(() => notification('Session Storage Data Pasted.'))
            .catch((error) => console.debug('Failed to get extensionClipboard:', error));

        await extensionMessenger.sendMessage('sendToBackground', dataToPaste)
            .then(() => notification('Session Storage on webpage has been updated.'))
            .catch((error) => console.debug(error));
    }

    const addCallback = async () => {
        const newKey = new Date().getTime().toString();
        const dataToAdd = deepCopy(storage.sessionStorageData);
        Object.assign(dataToAdd, { [newKey]: '{}' });
        notification(`New key-value pair added with key: ${newKey}.`);

        await extensionMessenger.sendMessage('sendToBackground', dataToAdd)
            .then(() => notification('Session Storage on webpage has been updated.'))
            .catch((error) => console.debug(error));
    }

    const deleteCallback = async () => {
        const dataUpdate = deepCopy(storage.sessionStorageData);
        notification(`key: ${storage.activeKey} has been deleted.`);
        delete dataUpdate[storage.activeKey];
        
        await extensionMessenger.sendMessage('sendToBackground', dataUpdate)
            .then(() => notification('Session Storage on webpage has been updated.'))
            .catch((error) => console.debug(error));
    }

    const clearCallback = async () => {
        await extensionMessenger.sendMessage('sendToBackground', {})
            .then(() => notification('Session Storage has been cleared.'))
            .catch((error) => console.debug(error));
    }
    
    onMount(async () => {
        /** Listen for changes to session data and update store. */
        const unwatch = wxtStorage.watch('local:extensionData', (data) => {
            setSessionStorageData(data);
        });

        /** Get session data if available and update store. */
        await extensionData.getValue()
            .then(data => setSessionStorageData(data))
            .catch(error => console.debug('Could not get session data at this time', error));

        onCleanup(() => {
            unwatch();
        });
    });

    return (
		<>
			<Header link={'/options'} text={'Options'}/>
			<div class={'grid grid-cols-12 text-[var(--borderColor)]'}>
				<div class={'col-span-3 flex justify-between items-end border-[1px] border-r-0 border-b-0 border-[var(--borderColor)]'}>
					<Control
						onClickCallback={selectAllKeys}>
						Select All
					</Control>
					<Control
						onClickCallback={unselectAllKeys}>
						Unselect All
					</Control>
				</div>
				<div class={'col-span-9 flex flex-1 flex-wrap border-[1px] border-b-0 border-[var(--borderColor)]'}>
					<div class={'w-full'}>
						<Tooltip position={'bottom'} text={'Copies all selected values.'}>
                            <Control onClickCallback={copyCallback}>
                                Copy
                            </Control>
                        </Tooltip>
						<Tooltip position={'bottom'} text={'Replaces tabs session data with clipboard data.'}>
                            <Control onClickCallback={pasteCallback}>
                                Paste
                            </Control>
                        </Tooltip>
					</div>
					<div class={'w-full'}>
                        <Tooltip position={'bottom'} text={'Add a new entry to the session data.'}>
                            <Control onClickCallback={addCallback}>
                                Add
                            </Control>
                        </Tooltip>
						<Tooltip position={'bottom'} text={'Delete the current item (cannot be undone).'}>
                            <Control onClickCallback={deleteCallback}>
                                Delete
                            </Control>
                        </Tooltip>
						<Tooltip position={'bottom'} text={'Clean all junk from session storage space.'}>
                            <Control
                                onClickCallback={clearCallback}>
                                Clear Storage
                            </Control>
                        </Tooltip>
					</div>
				</div>
			</div>
			<ViewGrid />
            <Toaster />
			<div class={'flex m-1 justify-start text-[var(--borderColor)]'}>
				<div class={'cursor-default mr-4'}>
					{version}
				</div>
			</div>
		</>
	);
}

export default Popup;
