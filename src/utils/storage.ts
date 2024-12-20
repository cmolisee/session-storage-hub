import { AVAILABLE_THEMES } from "./constants";

/**
 * WXT storage object for extension options.
 * Contains all user configurable options for the extension.
 */
export const extensionOptions = storage.defineItem<{ theme: AVAILABLE_THEMES }>(
    'sync:extensionOptions',
    {
        fallback: { theme: AVAILABLE_THEMES.LIGHT },
        init: () => ({ theme: AVAILABLE_THEMES.LIGHT }),
    }
);

/**
 * WXT storage object for the extension clipboard.
 * Contains all/any content the user coppies to the extension clipboard.
 * Content is stored as an object.
 */
export const extensionClipboard = storage.defineItem(
    'local:extensionClipboard',
);

/**
 * WXT storage object for the extension data.
 * Contains session data for the current tab.
 */
export const extensionData = storage.defineItem(
    'local:extensionData',
);