export interface IOption {
    value: string;
    label: string;
}

export interface IEditorProps {
    doc?: string;
    onDocChange?: (doc: string) => void;
    onEditorMount?: (editor: EditorView) => void;
}