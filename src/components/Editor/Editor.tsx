import CodeMirror, { BasicSetupOptions, EditorView, ReactCodeMirrorProps, ReactCodeMirrorRef, Text } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { Diagnostic, linter, lintGutter } from '@codemirror/lint';
import {
	errorToast,
	getDataAsFormattedJson,
	successToast,
} from '../../utils/Utils';
import './styles.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { subscribe, unsubscribe } from '../../utils/CustomEvents';
import {
	Sender,
	Action,
	IChromeMessage,
	IMessageResponse,
} from '../../types/types';
import { chromeApi } from '../../utils/ChromeUtils';
import { useStorageData } from '../../providers/useStorageData';

const BASIC_SETUP_OPTIONS: BasicSetupOptions = {
	allowMultipleSelections: true,
	autocompletion: true,
	bracketMatching: true,
	closeBrackets: true,
	closeBracketsKeymap: true,
	completionKeymap: true,
	// crosshairCursor: true,
	defaultKeymap: true,
	drawSelection: true,
	dropCursor: true,
	foldGutter: true,
	foldKeymap: true,
	highlightActiveLine: true,
	highlightActiveLineGutter: true,
	highlightSelectionMatches: true,
	highlightSpecialChars: true,
	history: true,
	historyKeymap: true,
	indentOnInput: true,
	lineNumbers: true,
	lintKeymap: true,
	rectangularSelection: true,
	searchKeymap: true,
	syntaxHighlighting: true,
}

// from jsonParseLinter
function getErrorPosition(error: SyntaxError, doc: Text): number {
	let m;
	if (m = error.message.match(/at position (\d+)/)) {
		return Math.min(+m[1], doc.length);
	}

	if (m = error.message.match(/at line (\d+) column (\d+)/)) {
		return Math.min(doc.line(+m[1]).from + (+m[2]) - 1, doc.length);
	}

	return 0;
}

const Editor = () => {
	const editorRef = useRef<ReactCodeMirrorRef>({});
	const { sessionStorageData, isEditing, setIsEditing, activeKey, activeValue } = useStorageData();
	const [code, setCode] = useState<string>('');



	const customLinter = () => (view: EditorView): Diagnostic[] => {
		try {
			JSON.parse(view.state.doc.toString());
		} catch (e) {
			if (!(e instanceof SyntaxError)) {
				throw e;
			}

			const pos = getErrorPosition(e, view.state.doc);
			const line = view.state.doc.lineAt(pos);

			return [{
				from: line.from,
				message: e.message,
				severity: 'error',
				to: line.to
			}];
		}

		return [];
	};

	const extensions = [EditorView.lineWrapping, json(), linter(customLinter()), lintGutter()];
	const handleOnChange = (val: string) => {
		if (!isEditing) {
			setIsEditing(true);
		}

		setCode(val);
	}

	const editorProps: ReactCodeMirrorProps = {
		value: code,
		height: '100%',
		width: '100%',
		theme: 'dark',
		basicSetup: BASIC_SETUP_OPTIONS,
		editable: true,
		indentWithTab: true,
		onChange: handleOnChange,
		extensions: extensions,
		// /** Some data on the statistics editor. */
		// onStatistics?(data: Statistics): void;
		// /** Fired whenever any state change occurs within the editor, including non-document changes like lint results. */
		// onUpdate?(viewUpdate: ViewUpdate): void;
		// /** The first time the editor executes the event. */
		// onCreateEditor?(view: EditorView, state: EditorState): void;
		// /**
		//  * Create a state from its JSON representation serialized with [toJSON](https://codemirror.net/docs/ref/#state.EditorState.toJSON) function
		//  */
		// initialState?: {
		// 	json: any;
		// 	fields?: Record<string, StateField<any>>;
		// };
	}

	const handleSubmitEditedData = useCallback(() => {
		setIsEditing(false);

		console.log('code:', code)
		console.log('parsed code:', getDataAsFormattedJson(code));
		const newValue = code;
		const dataDeepCopy = JSON.parse(JSON.stringify(sessionStorageData));
		dataDeepCopy[activeKey] = JSON.stringify(getDataAsFormattedJson(newValue));

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
	}, [code]);

	const handleCancelEdits = useCallback(() => {
		setIsEditing(false);
		setCode(activeValue);
	}, [sessionStorageData, activeKey, activeValue]);

	useEffect(() => {
		setCode(JSON.stringify(getDataAsFormattedJson(activeValue), null, 2));
	}, [editorRef.current, activeKey, activeValue]);

	useEffect(() => {
		subscribe('SaveEdits', handleSubmitEditedData);
		subscribe('CancelEdits', handleCancelEdits);

		return () => {
			unsubscribe('SaveEdits', handleSubmitEditedData);
			unsubscribe('CancelEdits', handleCancelEdits);
		};
	}, [editorRef.current, code]);

	return (
		<CodeMirror
			ref={editorRef}
			{...editorProps} />
	)
}

export default Editor;
