import {
	PropsWithChildren,
	createContext,
	useContext,
	useMemo,
	useReducer,
} from 'react';

interface IDataProps {
	sessionStorageData: object;
	isEditing: boolean;
	keys: string[];
	selectedKeys: string[];
	activeKey: string;
	activeValue: any;
}

interface IExtendedDataProps extends IDataProps {
	setSessionStorageData: (obj: object) => void;
	setIsEditing: (bool: boolean) => void;
	setSelectedKeys: (keys: string[]) => void;
	setActiveKey: (key: string) => void;
	selectAllKeys: () => void;
	unselectAllKeys: () => void;
}

function reducer(state: any, action: { type: string; data: any }) {
	switch (action.type) {
		// use for add and delete
		case 'setSessionStorageData': {
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
				keys: action.data.keys,
			};
		}
		case 'setSelectedKeys': {
			return {
				...state,
				selectedKeys: [...action.data.selectedKeys],
			};
		}
		case 'setActiveKey': {
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
	setSessionStorageData: function (): void { },
	setIsEditing: function (): void { },
	setSelectedKeys: function (): void { },
	setActiveKey: function (): void { },
	selectAllKeys: function (): void { },
	unselectAllKeys: function (): void { },
});

export const useStorageData = () => {
	return useContext(dataContext);
};

export const StorageDataProvider = ({ children }: PropsWithChildren) => {
	const [dataState, dispatch] = useReducer(reducer, {
		sessionStorageData: {},
		dataToCopy: {},
		isEditing: false,
		keys: [],
		selectedKeys: [],
		activeKey: '',
		activeValue: '',
		version: '',
	});

	const handleSetSessionStorageData = (obj: object) => {
		dispatch({ type: 'setSessionStorageData', data: { sessionStorageData: obj } });
	}

	const handleSetIsEditing = (bool: boolean) => {
		dispatch({ type: 'setIsEditing', data: { isEditing: bool } });
	};

	const handleSetSelectedKeys = (keys: string[]) => {
		dispatch({ type: 'setSelectedKeys', data: { selectedKeys: keys } });
	};

	const handleSetActiveKey = (key: string) => {
		if (
			!key ||
			dataState.keys.indexOf(key) < 0 ||
			Object.is(key, dataState.activeKey)
		) {
			return;
		}

		dispatch({ type: 'setActiveKey', data: { activeKey: key } });
	};

	const handleSelectAllKeys = () => {
		return dispatch({ type: 'selectAllKeys', data: { selectedKeys: dataState.keys } });
	};

	const handleUnselectAllKeys = () => {
		return dispatch({ type: 'unselectAllKeys', data: { selectedKeys: [] } });
	};

	return (
		<dataContext.Provider
			value={useMemo(() => {
				return {
					...dataState,
					setSessionStorageData: handleSetSessionStorageData,
					setIsEditing: handleSetIsEditing,
					setSelectedKeys: handleSetSelectedKeys,
					setActiveKey: handleSetActiveKey,
					selectAllKeys: handleSelectAllKeys,
					unselectAllKeys: handleUnselectAllKeys,
				};
			}, [dataState])}>
			{children}
		</dataContext.Provider>
	);
};

