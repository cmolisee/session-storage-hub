import { IStorageContext, IStorageShape } from "@/types/hooks";

const initialStorage: IStorageShape = {
    sessionStorageData: {},
    keys: [],
    selectedKeys: [],
    activeKey: '',
    activeValue: '',
};

/** Context for this provider. */
const StorageContext = createContext<IStorageContext>();

/**
 * Storage context.
 * @returns Storage values and functions in context.
 */
export function useStorage() {
    return useContext(StorageContext)!;
}

/**
 * Provides storage values and functions to all children.
 * @param props Contains children.
 * @returns A wrapper around all children with storage values and functions in its context.
 */
export const StorageProvider = (props: any) => {
    const [store, setStore] = createStore<IStorageShape>(initialStorage);

    /**
     * Set the session storage data object in storage.
     * @param {any} obj Session Storage data to set.
     */
    const setSessionStorageData = (obj: any) => {
		const keys = Object.keys(obj);
        setStore(
            produce((draft) => {
                draft.sessionStorageData = obj;
                draft.keys = deepCopy(keys);
                draft.selectedKeys = deepCopy(keys);
                draft.activeKey = keys[0];
                draft.activeValue = obj[keys[0]];
            })
        );
	}

    /**
     * Set the selectedKeys in storage.
     * @param {string[]} keys Array of keys to set.
     */
	const setSelectedKeys = (keys: string[]) => {
        setStore('selectedKeys', deepCopy(keys));
	};

    /**
     * Set the activeKey in storage.
     * @param {string} key Active key to set
     * @returns void
     */
	const setActiveKey = (key: string) => {
        if (!key || store.keys.indexOf(key) < 0 || Object.is(key, store.activeKey)) {
            return;
        }
		
        setStore(
            produce((draft) => {
                draft.activeKey = key;
                draft.activeValue = draft.sessionStorageData[key];
            })
        );
	};

    /**
     * Set selectedKeys in storage to array of all availalbe keys.
     */
	const selectAllKeys = () => {
		setStore('selectedKeys', deepCopy(store.keys) );
	};

    /**
     * Set selectedKeys in storage to empty array.
     */
	const unselectAllKeys = () => {
		setStore('selectedKeys', []);
	};

    return (
        <StorageContext.Provider value={{
            storage: store,
            setSessionStorageData,
            setSelectedKeys,
            setActiveKey,
            selectAllKeys,
            unselectAllKeys,
        }}>
            {props.children}
        </StorageContext.Provider>
    )
}
