export function getFormatedJson(object: any) {
	try {
		return JSON.parse(object);
	} catch {
		return object;
	}
};

export function getObjectType(object: any) {
    if (object === 'undefined') {
    } else if (typeof object === 'object') {
        return Array.isArray(object) ? 'array' : 'object';
    } else if (object === null || object === 'null') {
		return 'null';
	} else if (object === 'true' || object === 'false' || typeof object === 'boolean') {
		return 'boolean';
	} else if (!isNaN(object)) {
		return 'number';
	} else if (typeof object === 'string') {
        return 'string';
    }

    return 'undefined';
};
