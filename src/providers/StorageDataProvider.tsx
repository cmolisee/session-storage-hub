import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from 'react';

interface IDataObject {
	dataObject?: object;
}

interface IStorageData {
	data: object;
	keys: string[];
	selectedKeys: string[];
	dataKey: string;
	dataValue: any;
}

interface IStorageDataProps extends IStorageData {
	setDataKey: (newKey: string) => void;
	setSelectedKeys: (newKeys: string[]) => void;
	selectAll: () => void;
	unselectAll: () => void;
}

function reducer(state: any, action: { type: string; data: any }) {
	switch (action.type) {
		case 'setData': {
			const d = action.data.data ?? state.data;
			const k = Object.keys(d);
			const dk = k[0];
			const dv = d[dk];

			return {
				data: d,
				keys: k,
				selectedKeys: k,
				dataKey: dk,
				dataValue: dv,
			};
		}
		case 'setKeys': {
			return {
				data: state.data,
				keys: action.data.keys ? action.data.keys : state.keys,
				selectedKeys: state.keys,
				dataKey: state.dataKey,
				dataValue: state.dataValue,
			};
		}
		case 'setSelectedKeys': {
			return {
				data: state.data,
				keys: state.keys,
				selectedKeys: action.data.selectedKeys
					? action.data.selectedKeys
					: state.selectedKeys,
				dataKey: state.dataKey,
				dataValue: state.dataValue,
			};
		}
		case 'selectAll':
		case 'unselectAll': {
			return {
				data: state.data,
				keys: state.keys,
				selectedKeys: action.type === 'selectAll' ? state.keys : [],
				dataKey: state.dataKey,
				dataValue: state.dataValue,
			};
		}
		case 'setDataKey':
		case 'setDataValue': {
			const dk = action.data.dataKey
				? action.data.dataKey
				: state.dataKey;
			const dv = action.data?.dataValue
				? action.data.dataValue
				: state.data[dk as keyof typeof state.data];

			return {
				data: state.data,
				keys: state.keys,
				selectedKeys: state.selectedKeys,
				dataKey: dk,
				dataValue: dv,
			};
		}
		default:
			throw new Error(
				'StorageDataProps: reducer() action not recognized...'
			);
	}
}

const StorageDataContext = createContext<IStorageDataProps>({
	data: {},
	keys: [],
	selectedKeys: [],
	dataKey: '',
	dataValue: null,
	setDataKey: () => {},
	setSelectedKeys: () => {},
	selectAll: () => {},
	unselectAll: () => {},
});

export const useStorageData = () => {
	return useContext(StorageDataContext);
};

export const StorageDataProvider = ({
	dataObject,
	children,
}: PropsWithChildren<IDataObject>) => {
	const [dataState, dispatch] = useReducer(reducer, {
		data: {},
		keys: [],
		selectedKeys: [],
		dataKey: '',
		dataValue: null,
	});

	const handleSetKey = (newKey: string) => {
		if (!newKey || dataState.keys.indexOf(newKey) < 0) {
			return;
		}

		dispatch({ type: 'setDataKey', data: { dataKey: newKey } });
	};

	const handleSetSelectedKeys = (newKeys: string[]) => {
		dispatch({ type: 'setSelectedKeys', data: { selectedKeys: newKeys } });
	};

	const handleSelectAllKeys = () => {
		return dispatch({ type: 'selectAll', data: {} });
	};
	const handleUnselectAllKeys = () => {
		return dispatch({ type: 'unselectAll', data: {} });
	};

	useEffect(() => {
		if (dataObject) {
			dispatch({ type: 'setData', data: { data: dataObject } });
		}
	}, [dataObject]);

	return (
		<StorageDataContext.Provider
			value={{
				data: dataState.data,
				keys: dataState.keys,
				selectedKeys: dataState.selectedKeys,
				dataKey: dataState.dataKey,
				dataValue: dataState.dataValue,
				setDataKey: handleSetKey,
				setSelectedKeys: handleSetSelectedKeys,
				selectAll: handleSelectAllKeys,
				unselectAll: handleUnselectAllKeys,
			}}>
			{children}
		</StorageDataContext.Provider>
	);
};
