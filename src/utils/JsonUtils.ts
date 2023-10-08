export function getDataAsFormattedJson(object: any) {
	try {
		return JSON.parse(object);
	} catch {
		return object;
	}
}

export function getDataType(object: any) {
	if (typeof object === 'object') {
		return Array.isArray(object) ? 'array' : 'object';
	} else if (
		object === 'true' ||
		object === 'false' ||
		typeof object === 'boolean'
	) {
		return 'boolean';
	} else if (!isNaN(object)) {
		return 'number';
	} else if (typeof object === 'string' && (object as string).length > 0) {
		return 'string';
	} else if (typeof object === 'undefined') {
		return 'undefined';
	}

	return 'null';
}
