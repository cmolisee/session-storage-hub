import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import { areDeeplyEqual } from '../utils/Utils';

interface IStorageDataProviderProps {
	dataObject?: object;
}

interface IStorageData {
	data: object;
	isEditing: boolean;
	keys: string[];
	selectedKeys: string[];
	dataKey: string;
	dataValue: any;
}

interface IStorageDataProps extends IStorageData {
	setIsEditing: (bool: boolean) => void;
	setDataKey: (newKey: string) => void;
	setSelectedKeys: (newKeys: string[]) => void;
	selectAll: () => void;
	unselectAll: () => void;
	saveDataEdits: (key: string, edits: object) => void;
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
	isEditing: false,
	keys: [],
	selectedKeys: [],
	dataKey: '',
	dataValue: null,
	setIsEditing: () => {},
	setDataKey: () => {},
	setSelectedKeys: () => {},
	selectAll: () => {},
	unselectAll: () => {},
	saveDataEdits: () => {}
});

export const useStorageData = () => {
	return useContext(StorageDataContext);
};

export const StorageDataProvider = ({
	dataObject,
	children,
}: PropsWithChildren<IStorageDataProviderProps>) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [dataState, dispatch] = useReducer(reducer, {
		data: {},
		keys: [],
		selectedKeys: [],
		dataKey: '',
		dataValue: null,
	});

	const handleSetKey = (newKey: string) => {
		if (!newKey || dataState.keys.indexOf(newKey) < 0 || Object.is(newKey, dataState.dataKey)) {
			return;
		}

		dispatch({ type: 'setDataKey', data: { dataKey: newKey }});
	};

	const handleSetSelectedKeys = (newKeys: string[]) => {
		if (!areDeeplyEqual(newKeys, dataState.keys)) {
			dispatch({ type: 'setSelectedKeys', data: { selectedKeys: newKeys }});
		}
	};

	const handleSelectAllKeys = () => {
		return dispatch({ type: 'selectAll', data: { selectedKeys: dataState.keys }});
	};

	const handleUnselectAllKeys = () => {
		return dispatch({ type: 'unselectAll', data: { selectedKeys: [] }});
	};

	const handleSetIsEditing = (bool: boolean) => {
		if (isEditing !== bool) {
			setIsEditing(bool);
		}
	};

	const handleSaveDataEdits = (key: string, edits: object) => {
		if (!key || !edits.hasOwnProperty(key)) {
			return;
		}

		const updatedDeepCopy = JSON.parse(JSON.stringify(dataState.data));
		updatedDeepCopy[key] = edits;

		if (areDeeplyEqual(updatedDeepCopy, dataState.data)) {
			return dispatch({ type: 'setData', data: { data: updatedDeepCopy }});
		}
	};

	useEffect(() => {
		dispatch({ type: 'setData', data: { data: dataObject } });
		// if (dataObject && !areDeeplyEqual(dataObject, dataState.data)) {
		// 	dispatch({ type: 'setData', data: { data: dataObject } });
		// }
	}, [dataObject]);

	return (
		<StorageDataContext.Provider
			value={{
				data: dataState.data,
				isEditing: isEditing,
				keys: dataState.keys,
				selectedKeys: dataState.selectedKeys,
				dataKey: dataState.dataKey,
				dataValue: dataState.dataValue,
				setIsEditing: handleSetIsEditing,
				setDataKey: handleSetKey,
				setSelectedKeys: handleSetSelectedKeys,
				selectAll: handleSelectAllKeys,
				unselectAll: handleUnselectAllKeys,
				saveDataEdits: handleSaveDataEdits,
			}}>
			{children}
		</StorageDataContext.Provider>
	);
};
