import { Extension } from '@codemirror/state';

export interface IStorageShape {
    sessionStorageData: any;
    keys: string[];
    selectedKeys: string[];
    activeKey: string;
    activeValue: any;
}

export interface IStorageContext {
    storage: IStorageShape;
    setSessionStorageData: (obj: any) => void;
    setSelectedKeys: (keys: string[]) => void;
    setActiveKey: (key: string) => void;
    selectAllKeys: () => void;
    unselectAllKeys: () => void;
}

export interface IExtensionOptionsShape {
    theme: AVAILABLE_THEMES;
};

export interface IExtensionOptionsContext {
    extensionOptions: IExtensionOptionsShape;
    setExtensionOptions: (options: any) => Promise<void>
}