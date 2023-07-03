export function getFormatedJson(object: any) {
	try {
		return JSON.parse(object);
	} catch {
		return object;
	}
};

export function getPrimitiveType(object: any) {
	if (object === null || object === 'null') {
		return '--null';
	} else if (object === 'true' || object === 'false' || typeof object === 'boolean') {
		return '--boolean';
	} else if (!isNaN(object)) {
		return '--number';
	} else if (typeof object === 'string') {
        return '--string';
    }

    throw new Error('Object type is not a primitive...');
};


/* The `JSONViewer.prototype.parseToHtml` function is recursively parsing a JSON object and creating an
HTML representation of it. It takes in two arguments: `obj` (the JSON object to parse) and `element`
(the parent HTML element to append the parsed HTML representation to). */
JSONViewer.prototype.parseToHtml = function (obj, element) {
	const formatted = this.formatObj(obj);

	if (Array.isArray(formatted)) {
		for (const item of formatted) {
			const arrayWrapper = this.createArrayWrapper();
			element.appendChild(arrayWrapper);

			this.parseToHtml(item, arrayWrapper);
		}
	} else if (formatted !== null && typeof formatted === 'object') {
		for (const [key, value] of Object.entries(formatted)) {
			const objWrapper = this.createObjWrapper();
			element.appendChild(objWrapper);

			if (element === this.config.parentEle) {
				objWrapper.classList.remove('hidden');
			}

			objWrapper.appendChild(this.createKeyEle(key));
			this.parseToHtml(value, objWrapper);
		}
	} else {
		element.appendChild(this.createValueEle(formatted || 'null'));
	}
};
