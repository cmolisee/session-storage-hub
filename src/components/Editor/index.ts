import { IEditorProps } from "@/types/global";
import { Compartment, EditorState, Extension, StateEffect } from "@codemirror/state";
import { EditorView } from "codemirror";
import { Accessor } from "solid-js";

export function createEditor( props: IEditorProps, ref: Accessor<HTMLDivElement|undefined>) {
    let view: EditorView | undefined;

    onMount(() => {
        const state = EditorState.create({
            doc: props.doc,
        });

        view = new EditorView({
            state,
            parent: ref(),
            dispatch: (tr): void => {
                view?.update([tr]);

                if (tr?.docChanged) {
                    const change = tr.newDoc.sliceString(0, tr.newDoc.length);
                    props.onDocChange?.(change);
                }
            }
        });

        props.onEditorMount?.(view);

        onCleanup(() => {
            view?.destroy();
        });
    });

    createEffect(
        on(
            () => props.doc,
            (doc) => {
                if (doc === view?.state.doc.toString()) {
                    return;
                }

                view?.dispatch({
                    changes: {
                        from: 0,
                        to: view?.state?.doc?.length ?? 0,
                        insert: doc,
                    },
                });
            },
            { defer: true },
        )
    );
    
    function extension(ext: Extension) {
        const compartment = new Compartment();

        onMount(() => {
            view?.dispatch({ effects: StateEffect.appendConfig.of(compartment.of(ext)) });
        });

        return function reconfigure(ext: Extension) {
            view?.dispatch({ effects: compartment.reconfigure(ext) });
        }
    }

    function updateDoc(doc: string) {
        view?.dispatch({
            changes: {
                from: 0,
                to: view?.state?.doc?.length ?? 0,
                insert: doc,
            },
        });
    }

    return { extension, updateDoc };
}