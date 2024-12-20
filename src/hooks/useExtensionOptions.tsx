import { IExtensionOptionsShape, IExtensionOptionsContext } from '@/types/hooks';
import { AVAILABLE_THEMES } from '@/utils/constants';
import { extensionOptions } from '@/utils/storage';
import { getThemeStyles } from '@/utils/theme';

const initialExtensionOptions: IExtensionOptionsShape = {
	theme: AVAILABLE_THEMES.LIGHT,
};

/** Context for this provider. */
const extensionOptionsContext = createContext<IExtensionOptionsContext>();

/**
 * Extension Options context.
 * @returns Extension Option values and functions in context.
 */
export function useExtensionOptions() {
    return useContext(extensionOptionsContext)!;
}

/**
 * Provides Extension Option values and functions to all children.
 * @param props Contains children.
 * @returns A wrapper around all children with Extension Options values and functions in its context.
 */
export const ExtensionProvider = (props: any) => {
    const [store, setStore] = createStore<IExtensionOptionsShape>(initialExtensionOptions);

    /**
     * Set extension options in provider and browser storage.
     * @param {IExtensionOptionsShape} options Extension options.
     */
    const handleSetExtensionOptions = async (options: IExtensionOptionsShape) => {
        await extensionOptions.setValue(options)
            .catch((error) => console.debug('Failed to set extensionOptions:', error));
        setStore(
            produce((draft) => {
                draft.theme = options.theme
            }),
        );
    };

    /**
     * Retrieves extension options from browser storage and updates provider value.
     */
    onMount(async () => {
        const options = await extensionOptions.getValue()
            .catch((error) => console.debug('Failed to get extensionOptions:', error));

        if (options?.theme) {
            setStore(
                produce((draft) => {
                    draft.theme = options.theme
                })
            );
        }
    });

    /**
     * When extension options changes, generate styles and update.
     */
    createEffect(() => {
        const html = document.documentElement;
        const styles = getThemeStyles(store.theme);
		
        if (styles) {
            Object.entries(styles).forEach((s) => html.style.setProperty(s[0], s[1]));
        }
    });

    /**
     * Memoized values to return from provider.
     */
    const getValues = createMemo(() => ({
        extensionOptions: store,
        setExtensionOptions: handleSetExtensionOptions,
    }));

    return (
        <extensionOptionsContext.Provider value={getValues()}>
            {props.children}
        </extensionOptionsContext.Provider>
    )
}
