import { StateEffect, StateField, Transaction } from "@codemirror/state";
import { EditorView, Panel, showPanel } from "@codemirror/view";

/**
 * Effect for editor panel.
 */
const editorPanelEffect = StateEffect.define<IEditorPanelState>();

/**
 * State for editor panel.
 * @param initialDoc Initial value of the document before any change.
 * @param onSaveCallback Function to call when user clicks save.
 * @returns {StateField} State for building the Effect.
 */
function createEditorPanelState(initialDoc: string, onSaveCallback: (doc: string) => void) {
    return StateField.define<IEditorPanelState>({
        create: () => ({
            initialDoc: initialDoc,
            saveCallback: onSaveCallback,
            change: false,
        }),
        update(value: any, transaction: Transaction) {
            const currentDoc = transaction.newDoc.toString();
            const change = currentDoc !== value.initialDoc;

            // skip unnecessary updates
            if (!transaction.docChanged) {
                return value;
            }

            // find/update the existing effect
            for (let e of transaction.effects) {
                if (e.is(editorPanelEffect)) {
                    return {
                        initialDoc: value.initialDoc,
                        saveCallback: value.saveCallback,
                        change,
                    }
                }
            }

            // if an existing effect is not found
            return {
                initialDoc: value.initialDoc,
                saveCallback: value.saveCallback,
                change,
            }
        },
        provide: (field: StateField<IEditorPanelState>) => {
            return showPanel.from(field, ({ change }) => {
                return change ? createEditorPanel(field) : null;
            });
        }
    });
}

/**
 * Creates the panel for the effect.
 * @param {StateField} editorPanelState The effect state which gets scoped into the second function.
 * @param {EditorView} view This is called by codemirror logic as the PanelConstructor.
 * @returns {Panel} The Editor Panel.
 */
const createEditorPanel = (editorPanelState: StateField<IEditorPanelState>) => (view: EditorView) => {
    const editorState = view.state.field<IEditorPanelState>(editorPanelState);

    if (!editorState.change) {
        return { dom: {} as HTMLElement } as Panel;
    }

    const div = document.createElement('div');
    div.className = 'cm-editor-panel flex justify-end gap-8 mx-4 font-bold text-[var(--borderColor)]';

    const save = document.createElement('button');
    save.className = 'hover:no-underline hover:text-[var(--buttonHoverColor)] hover:border-[var(--buttonHoverColor)]';
    save.innerText = 'Save';
    save.onclick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        view && editorState?.saveCallback(view.state.doc.toString());
    };
    
    const cancel = document.createElement('button');
    cancel.className = 'hover:no-underline hover:text-[var(--buttonHoverColor)] hover:border-[var(--buttonHoverColor)]';
    cancel.innerText = 'Cancel';
    cancel.onclick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        view?.dispatch({
            changes: {
                from: 0,
                to: view?.state?.doc?.length ?? 0,
                insert: editorState.initialDoc,
            }
        });
    };

    div.append(save, cancel);

    return { dom: div } as Panel;
}

/**
 * Editor Panel Effect constructor. Used for building the effect to be provided to the editor.
 * @param onSaveCallback Save Callback to be called when user clicks save.
 * @returns {Effect} Editor Panel Effect.
 */
export function editorPanel(initialDoc: string, onSaveCallback: any) {
    const editorPanelState = createEditorPanelState(initialDoc, onSaveCallback);
    return [editorPanelState];
}