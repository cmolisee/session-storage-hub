
import { EditorView } from "codemirror";
import { json } from "@codemirror/lang-json";
import { createEditor } from '../Editor';
import { Diagnostic, linter, lintGutter, lintKeymap } from '@codemirror/lint';
import { crosshairCursor, drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { editorPanel } from "../EditorPanelEffect";
import { jsonFormat } from "@/utils/utils";
import './styles.css';

export default function ViewGridValue(props: any) {
    const { storage } = useStorage();
    const { extensionOptions } = useExtensionOptions()
    const viewGridStyles = 'ViewGridValue relative overflow-x-hidden';

    const editorValue = () => storage.activeValue;
    const theme = () => extensionOptions.theme;

    let editorRef: HTMLDivElement | undefined;
    
    const editorLinter = linter((view: EditorView): Diagnostic[] => {
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
    });

    const onSaveCallback = async (doc: string) => {
        const data = deepCopy(storage.sessionStorageData);
        data[storage.activeKey] = doc;
        
        await extensionMessenger.sendMessage('sendToBackground', data)
            .catch((error) => console.debug(error));
    }

    onMount(() => {
        const { extension, updateDoc } = createEditor(
            { doc: jsonFormat(editorValue()) },
            () => editorRef
        );

        extension(lineNumbers());
        extension(highlightActiveLineGutter());
        extension(highlightSpecialChars());
        extension(history());
        extension(foldGutter());
        extension(drawSelection());
        extension(dropCursor());
        extension(EditorState.allowMultipleSelections.of(true));
        extension(indentOnInput());
        extension(syntaxHighlighting(defaultHighlightStyle, { fallback: true }));
        extension(bracketMatching());
        extension(closeBrackets());
        extension(autocompletion());
        extension(rectangularSelection());
        extension(crosshairCursor());
        extension(highlightActiveLine());
        extension(highlightSelectionMatches());
        extension(keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap,
        ]));
        extension(EditorView.lineWrapping);
        extension(json());
        extension(indentUnit.of('    '));
        extension(lintGutter());
        extension(editorLinter);

        const reconfigureEditorPanel = extension(editorPanel(jsonFormat(editorValue()), onSaveCallback));
        const reconfigureTheme = extension(getEditorTheme(theme()));
    
        // reconfigure initialDoc value on data update
        createEffect(on(editorValue, () => reconfigureEditorPanel(
            editorPanel(jsonFormat(editorValue()),  onSaveCallback)
        )));
        // reconfigure doc value on data update
        createEffect(on(editorValue, (doc) => updateDoc(jsonFormat(doc))));
        // reconfigure theme on theme update
        createEffect(on(theme, () => reconfigureTheme(getEditorTheme(theme()))));
    });

	return (
		<div class={viewGridStyles}>
			<div class={'max-h-[450px]'} ref={editorRef} />
		</div>
	);
}
