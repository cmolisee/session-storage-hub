import toast from "solid-toast";

/**
 * Merge css class strings together.
 * Necessary for tailwind to properly build css since it cannot handle dynamic classes.
 * @param {string[]} args Array of CSS strings.
 * @returns {string} A properly concatenated CSS string.
 */
export function tailwindMerge(...args: string[]) {
    return args.join(' ');
}

/**
 * Formats a value in json for the editor.
 * @param value To be formatted.
 * @returns Formatted JSON string.
 */
export function jsonFormat(value: any): string {
    value = safeParse(value);

    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return `${value}`;
    }

    if (typeof value === 'string') {
      return JSON.stringify(value, null , 4);
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 4);
    }

    return '';
  }

/**
 * Get the line number of an error in a CodeMirror Doc.
 * @param {Error} error The error to search for.
 * @param doc The document to search.
 * @returns {number} The line number that contains the error.
 */
export function getErrorPosition(error: SyntaxError, doc: any): number {
	const pos = error.message.match(/at position (\d+)/);
	if (pos) {
		return Math.min(+pos[1], doc?.length ?? 0);
	}

	const lineCol = error.message.match(/at line (\d+) column (\d+)/);
	if (lineCol) {
		return Math.min(doc.line(+lineCol[1]).from + (+lineCol[2]) - 1, doc?.length ?? 0);
	}

	return 0;
}

/**
 * Safely parses an object and allows the processing to continue on fail.
 * @param obj 
 * @param isLogging 
 * @returns Result of JSON.parse() on success or void.
 */
export function safeParse(obj: any, isLogging: boolean = false) {
    try {
        return JSON.parse(obj);
    } catch (e: any) {
        if (isLogging) {
            console.debug('Error parsing object: ', e);
        }
        return obj;
    }
}

/**
 * Creates a deep copy of the passed object.
 * @param obj 
 * @returns Copy of the object or void on error in JSON.parse().
 */
export function deepCopy(obj: any) {
    return safeParse(JSON.stringify(obj));
}

/** Helper for displaying toast notifications. */
export function notification(txt: string) {
    toast(txt, {
        duration: 3000,
        position: 'bottom-center',
        unmountDelay: 500,
        style: {
            'background-color': 'var(--specialTextColor)',
            'font-weight': 'bold',
            'color': 'var(--backgroundColor)'
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#000',
        },
        ariaProps: {
            role: 'status',
            'aria-live': 'polite',
        },
    });
}