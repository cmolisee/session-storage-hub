import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useMemo,
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
}

function reducer(state: any, action: { type: string; data: any }) {
	switch (action.type) {
		case 'setData': {
			const d = action.data.data ?? state.data
			const k = Object.keys(d);
			const dk = k[0];
			const dv = d[dk];

			return {
				...state.data,
				data: d,
				keys: k,
				selectedKeys: k,
				dataKey: dk,
				dataValue: dv,
			};
		}
		case 'setKeys': {
			return {
				...state.data,
				keys: action.data.keys ? action.data.keys : state.keys,
			};
		}
		case 'setSelectedKeys': {
			return {
				...state.data,
				selectedKeys: action.data.selectedKeys
					? action.data.selectedKeys
					: state.selectedKeys,
			};
		}
		case 'selectAll':
		case 'unselectAll': {
			return {
				...state.data,
				selectedKeys: action.type === 'selectAll' ? state.keys : [],
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
				...state.data,
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
});

export const useStorageData = () => {
	return useContext(StorageDataContext);
};

export const StorageDataProvider = ({
	dataObject,
	children,
}: PropsWithChildren<IStorageDataProviderProps>) => {
	const [isEditing, setIsEditing] = useState<boolean>();
	const [dataState, dispatch] = useReducer(reducer, {
		data: {},
		keys: [],
		selectedKeys: [],
		dataKey: '',
		dataValue: null,
	});

	const handleSetIsEditing = (bool: boolean) => {
		setIsEditing(bool);
	};

	const handleSetKey = (newKey: string) => {
		if (
			!newKey ||
			dataState.keys.indexOf(newKey) < 0 ||
			Object.is(newKey, dataState.dataKey)
		) {
			return;
		}

		dispatch({ type: 'setDataKey', data: { dataKey: newKey } });
	};

	const handleSetSelectedKeys = (newKeys: string[]) => {
		if (!areDeeplyEqual(newKeys, dataState.keys)) {
			dispatch({
				type: 'setSelectedKeys',
				data: { selectedKeys: newKeys },
			});
		}
	};

	const handleSelectAllKeys = () => {
		return dispatch({
			type: 'selectAll',
			data: { selectedKeys: dataState.keys },
		});
	};

	const handleUnselectAllKeys = () => {
		return dispatch({ type: 'unselectAll', data: { selectedKeys: [] } });
	};

	useEffect(() => {
		dispatch({ type: 'setData', data: { data: dataObject } });
		setIsEditing(false);
	}, [dataObject]);

	return (
		<StorageDataContext.Provider
			value={useMemo(() => ({
				...dataState,
				isEditing: isEditing ?? false,
				setIsEditing: handleSetIsEditing,
				setDataKey: handleSetKey,
				setSelectedKeys: handleSetSelectedKeys,
				selectAll: handleSelectAllKeys,
				unselectAll: handleUnselectAllKeys,
			}), [dataObject, isEditing])}>
			{children}
		</StorageDataContext.Provider>
	);
};
