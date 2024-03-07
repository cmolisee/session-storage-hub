import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from 'react';
import { areDeeplyEqual } from '../utils/Utils';

interface IDataProps {
	sessionStorageData: object;
	isEditing: boolean;
	keys: string[];
	selectedKeys: string[];
	activeKey: string;
	activeValue: any;
}

interface IExtendedDataProps extends IDataProps {
	setIsEditing: (bool: boolean) => void;
	setSelectedKeys: (selectedKeys: string[]) => void;
	setActiveKey: (activeKey: string) => void;
	setActiveValue: (activeValue: string) => void;
	selectAllKeys: () => void;
	unselectAllKeys: () => void;
}

function reducer(state: any, action: { type: string; data: any }) {
	switch (action.type) {
		case 'setData': {
			const d = action.data.sessionStorageData;
			const k = Object.keys(d);
			const ak = k[0];
			const av = d[ak];

			return {
				...state,
				sessionStorageData: d,
				isEditing: false,
				keys: k,
				selectedKeys: k,
				activeKey: ak,
				activeValue: av,
			};
		}
		case 'setIsEditing': {
			return {
				...state,
				isEditing: action.data.isEditing
			};
		}
		case 'setKeys': {
			return {
				...state,
				keys: action.data.keys ? action.data.keys : state.keys,
			};
		}
		case 'setSelectedKeys': {
			return {
				...state,
				selectedKeys: action.data.selectedKeys
					? action.data.selectedKeys
					: state.selectedKeys,
			};
		}
		case 'setActiveKey':
		case 'setActiveValue': {
			const ak = action?.data?.activeKey
				? action.data.activeKey
				: state.activeKey;
			const av = action?.data?.activeValue
				? action.data.activeValue
				: state.sessionStorageData[ak];

			return {
				...state,
				activeKey: ak,
				activeValue: av,
			};
		}
		case 'selectAllKeys':
		case 'unselectAllKeys': {
			return {
				...state,
				selectedKeys: action.type === 'selectAllKeys' ? state.keys : [],
			};
		}
		default:
			throw new Error(
				'StorageDataProps: reducer() action not recognized...'
			);
	}
}

const dataContext = createContext<IExtendedDataProps>({
	sessionStorageData: {},
	isEditing: false,
	keys: [],
	selectedKeys: [],
	activeKey: '',
	activeValue: undefined,
	setIsEditing: function (): void { },
	setSelectedKeys: function (): void { },
	setActiveKey: function (): void { },
	setActiveValue: function (): void { },
	selectAllKeys: function (): void { },
	unselectAllKeys: function (): void { },
});

export const useData = () => {
	return useContext(dataContext);
};

export const StorageDataProvider = ({ children, data }: PropsWithChildren<{ data: object }>) => {
	const [dataState, dispatch] = useReducer(reducer, {
		sessionStorageData: {},
		isEditing: false,
		keys: [],
		selectedKeys: [],
		activeKey: '',
		activeValue: '',
		version: '',
	});

	const handleSetIsEditing = (bool: boolean) => {
		dispatch({ type: 'setIsEditing', data: { isEditing: bool } });
	};

	const handleSetActiveKey = (newKey: string) => {
		if (
			!newKey ||
			dataState.keys.indexOf(newKey) < 0 ||
			Object.is(newKey, dataState.activeKey)
		) {
			return;
		}

		dispatch({ type: 'setActiveKey', data: { activeKey: newKey } });
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
			type: 'selectAllKeys',
			data: { selectedKeys: dataState.keys },
		});
	};

	const handleUnselectAllKeys = () => {
		return dispatch({ type: 'unselectAllKeys', data: { selectedKeys: [] } });
	};

	useEffect(() => {
		dispatch({ type: 'setData', data: { sessionStorageData: data } });
	}, [data]);

	return (
		<dataContext.Provider
			value={{
				...dataState,
				setIsEditing: handleSetIsEditing,
				setActiveKey: handleSetActiveKey,
				setSelectedKeys: handleSetSelectedKeys,
				selectAll: handleSelectAllKeys,
				unselectAll: handleUnselectAllKeys,
			}}>
			{children}
		</dataContext.Provider>
	);
};

