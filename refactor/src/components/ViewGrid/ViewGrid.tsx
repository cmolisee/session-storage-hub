import ViewGridKey from '../ViewGridKey';
import ViewGridValue from '../ViewGridValue';
import './ViewGrid.scss';
import { useStorageData } from '../../providers/useStorageData';
import { useEffect } from 'react';
import { subscribe, unsubscribe } from '../../utils/CustomEvents';
import { Action, IChromeMessage, Sender } from '../../types/types';
import { getCurrentTabUId } from '../../utils/Chrome-Utils';

export interface IKeyValuePair {
    [key: string]: any;
}

interface IViewGridProps {
    className?: string;
}

const ViewGrid = ({
    className,
}: IViewGridProps) => {
    const {data, keys, selectedKeys, setDataKey, selectAll, unselectAll} = useStorageData();

    const handleCopy = () => {
        console.log('copy');

        let clipboard = {};
        Object.entries(data).forEach((e) => {
            if (selectedKeys.indexOf(e[0]) >= 0) {
                clipboard[e[0] as keyof typeof data] = e[1];
            }
        });

        chrome.storage.local.set({ clipboard: clipboard });
    }

    const handlePaste = async () => {
        console.log('paste');
        
        const clipboard = await chrome.storage.local.get(['clipboard']);
        const message: IChromeMessage = {
            from: Sender.Extension,
            action: Action.Update,
            message: clipboard,
        };

        getCurrentTabUId((id) => {
            id && chrome.tabs.sendMessage(
                id,
                message,
                (res) => {
                    console.log('response from request', res);
                    // handle possible error response
                }
            );
        });
    }
    
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
        }
    }, []);

    return (
        <div className={`ViewGrid ${className ?? ''}`}>
            <div className={'ViewGrid__30'}>
                {keys && keys.map((key, i) => {
                    return <ViewGridKey key={i} keyName={key} callback={() => setDataKey && setDataKey(key)} />
                })}
            </div>
            <div className={'ViewGrid__70'}>
                <ViewGridValue />
            </div>
        </div>
    );
}

export default ViewGrid;