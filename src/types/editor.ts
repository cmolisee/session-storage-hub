interface IEditorPanelState {
    initialDoc: string;
    saveCallback: (doc: string) => void;
    change: boolean;
}