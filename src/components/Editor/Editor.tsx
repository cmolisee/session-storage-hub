import AceEditor, { IAceEditorProps } from 'react-ace';
import { useStorageData } from '../../providers/StorageDataProvider';
import {
	errorToast,
	getDataAsFormattedJson,
	successToast,
} from '../../utils/Utils';
import 'ace-builds/src-noconflict/mode-json';
import './styles.css';
import { useCallback, useEffect, useRef } from 'react';
import { Ace } from 'ace-builds';
import { subscribe, unsubscribe } from '../../utils/CustomEvents';
import {
	Sender,
	Action,
	IChromeMessage,
	IMessageResponse,
} from '../../types/types';
import { chromeApi } from '../../utils/ChromeUtils';
// import 'ace-builds/src-noconflict/theme-github';

const Editor = () => {
	const aceRef = useRef<Ace.Editor>();
	const { data, dataKey, dataValue, setIsEditing } = useStorageData();

	const submitEditedData = useCallback(async () => {
		setIsEditing(false);

		const editorValue = aceRef?.current?.session?.getValue() as string;
		const dataDeepCopy = JSON.parse(JSON.stringify(data));
		dataDeepCopy[dataKey] = editorValue;

		chromeApi(
			{
				from: Sender.Extension,
				action: Action.Update,
				message: { updatedData: dataDeepCopy },
			} as IChromeMessage,
			async (res: IMessageResponse) => {
				if (!chrome?.storage) {
					errorToast('503', 'Chrome Storage API is not available.');
					return;
				}

				await chrome.storage.local.set({ data: res.data });
				successToast(null, 'Session Storage Data Pasted.');
			}
		);
	}, [data, dataKey, dataValue]);

	const cancelEdits = () => {
		aceRef?.current?.session?.setValue(dataValue);
		setIsEditing(false);
	};

	useEffect(() => {
		aceRef?.current?.session?.getUndoManager().reset();

		subscribe('SaveEdits', submitEditedData);
		subscribe('CancelEdits', cancelEdits);

		return () => {
			unsubscribe('SaveEdits', submitEditedData);
			unsubscribe('CancelEdits', cancelEdits);
		};
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
		value: JSON.stringify(getDataAsFormattedJson(dataValue), null, '\t'),
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
			setIsEditing(changeValue !== dataValue);
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
	};

	return <AceEditor {...props} />;
};

export default Editor;
