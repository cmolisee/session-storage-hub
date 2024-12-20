/**
 * Messaging namespaces used to set the namespace for messages with @webext-core/messaging.
 * @typedef {MESSAGE_NAMESPACES}
 * @enum {string}
 */
export enum MESSAGE_NAMESPACES {
    WEBPAGE = '@ssh/messaging/webpage',
    EXTENSION = '@ssh/messagng/extension',
}

/**
 * Messaging constants for webpage messages.
 * @typedef {WEBPAGE_ACTIONS}
 * @enum {string}
 */
export enum WEBPAGE_ACTIONS {
    UPDATE = 'ssh_update', // an update from the webpage
}

/**
 * Messaging constants for extension messages.
 * @typedef {EXTENSION_ACTIONS}
 * @enum {string}
 */
export enum EXTENSION_ACTIONS {
    UPDATE = 'ssh_update', // an update from the extension
    FILL = 'ssh_fill',
    CLEAN = 'ssh_clean',
    CLEAR = 'ssh_clear',
}

/**
 * Theme constants.
 * @typedef {AVAILABLE_THEMES}
 * @enum {string}
 */
export enum AVAILABLE_THEMES {
	LIGHT = 'light',
	DARK = 'dark',
	TOKYO_NIGHT = 'tokyo-night',
	NOCTIS_LIGHT = 'noctis-light',
	BESPIN = 'bespin',
	ANDROMEDA = 'andromeda',
}