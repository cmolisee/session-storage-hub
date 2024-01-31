import AceEditor, { IAceEditorProps } from 'react-ace';
import { useStorageData } from '../../providers/StorageDataProvider';
import { getDataAsFormattedJson } from '../../utils/Utils';
import 'ace-builds/src-noconflict/mode-json';
import './styles.css';
import { useEffect, useRef, useState } from 'react';
import { Ace } from 'ace-builds';
// import 'ace-builds/src-noconflict/theme-github';

const Editor = () => {
	const aceRef = useRef<Ace.Editor>();
	const { dataValue, setIsEditing } = useStorageData();
	const [value, setValue] = useState<string>();

	useEffect(() => {
		console.log('render...');
		aceRef?.current?.session?.getUndoManager().reset();
		setValue(JSON.stringify(getDataAsFormattedJson(dataValue), null, '\t'));
	}, [dataValue]);
	
	const props: IAceEditorProps = {
		name: 'editor',
		mode: 'json',
		// theme: '',
		height: '100%',
		width: '100%',
		// className: '',
		wrapEnabled: true,
		// readOnly?: boolean;
		// minLines?: number;
		// maxLines?: number;
		// navigateToFileEnd?: boolean;
		// debounceChangePeriod?: number;
		// enableBasicAutocompletion?: boolean | string[];
		// enableLiveAutocompletion?: boolean | string[];
		// tabSize?: number;
		value: value,
		// placeholder?: string;
		// defaultValue?: string;
		// scrollMargin?: number[];
		// enableSnippets?: boolean;
		// onSelectionChange?: (value: any, event?: any) => void;
		// onCursorChange?: (value: any, event?: any) => void;
		// onInput?: (event?: any) => void;
		onLoad: (editor: Ace.Editor) => {
			aceRef.current = editor;
		},
		// onValidate?: (annotations: Ace.Annotation[]) => void;
		// onBeforeLoad?: (ace: typeof AceBuilds) => void;
		onChange: (changeValue: string) => {
			if (changeValue !== value) {
				setIsEditing(true);
				setValue(changeValue);
			}
		},
		// onSelection?: (selectedText: string, event?: any) => void;
		// onCopy?: (value: string) => void;
		// onPaste?: (value: string) => void;
		// onFocus?: (event: any, editor?: Ace.Editor) => void;
		// onBlur?: (event: any, editor?: Ace.Editor) => void;
		// onScroll?: (editor: IEditorProps) => void;
		// editorProps: {
		// 	blockScrolling: true,
		// 	blockSelectEnabled: true,
		// 	enableBlockSelect: true,
		// 	enableMultiselect: true,
		// 	highlightPending: true,
		// 	highlightTagPending: true,
		// }
		setOptions: {
			showFoldWidgets: true,
		},
		// keyboardHandler?: string;
		// commands?: ICommand[];
		// annotations: [{ row: 0, column: 0, type: 'error', text: 'Some error.'}],
		// markers: [{ startRow: 0, startCol: 0, endRow: 1, endCol: 20, className: 'error-marker', type: 'fullLine' }],
	}
	
	return (
		<AceEditor {...props} />
	);
};

export default Editor;
