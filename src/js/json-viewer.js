/**
 * The JSONViewer function is a JavaScript code that creates an HTML representation of a JSON object.
 * @param config - An object containing the following properties: data (json object to convert) and
 * parentEle (DOM parent to append to)
 */
export default function JSONViewer(config) {
	this.config = Object.assign({ data: {}, parentEle: null }, config);

	if (this.config.parentEle === null) {
		throw new Error('JSONViewer object requires the parentEle argument...');
	}
	this.render();
}

/* The `JSONViewer.prototype.render` function is rendering the HTML representation of the JSON object
by calling the `parseToHtml` function with the JSON object and the parent element as arguments. It
first retrieves the JSON object and parent element from the `config` object passed to the
`JSONViewer` constructor. */
JSONViewer.prototype.render = function () {
	const obj = this.config.data;
	const parentEle = this.config.parentEle;

	this.parseToHtml(obj, parentEle);
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

/* The `JSONViewer.prototype.createObjWrapper` function is creating a new HTML `div` element that will
serve as a wrapper for a JSON object. It adds the CSS class `jsonObj` to the element and sets it to
be initially hidden by adding the `hidden` class. It then calls the `addToggleListener` function to
add a click event listener to the element that will toggle its visibility. Finally, it returns the
created element. */
JSONViewer.prototype.createObjWrapper = function () {
	const jsonObjEle = document.createElement('div');

	jsonObjEle.classList.add('jsonObj');
	jsonObjEle.classList.add('hidden');
	this.addToggleListener(jsonObjEle);

	return jsonObjEle;
};

/* The `JSONViewer.prototype.createArrayWrapper` function is creating a new HTML `div` element that
will serve as a wrapper for a JSON array. It adds the CSS class `jsonArray` to the element and
returns the created element. */
JSONViewer.prototype.createArrayWrapper = function () {
	const jsonObjEle = document.createElement('div');

	jsonObjEle.classList.add('jsonArray');

	return jsonObjEle;
};

/* The `JSONViewer.prototype.createKeyEle` function is creating a new HTML `div` element that will
serve as a wrapper for a JSON object key. It sets the innerHTML of the element to the `key` argument
passed to the function and adds the CSS class `jsonKey` to the element. Finally, it returns the
created element. */
JSONViewer.prototype.createKeyEle = function (key) {
	const keyEle = document.createElement('div');

	keyEle.innerHTML = key;
	keyEle.classList.add('jsonKey');

	return keyEle;
};

/* The `JSONViewer.prototype.createValueEle` function is creating a new HTML `div` element that will
serve as a wrapper for a JSON object value. It sets the innerHTML of the element to the `val`
argument passed to the function and adds the CSS classes `jsonVal` and `this.getPrimitiveClass(val)`
to the element. The `getPrimitiveClass` function is used to determine the appropriate CSS class to
add based on the type of the value. Finally, it returns the created element. */
JSONViewer.prototype.createValueEle = function (val) {
	const valEle = document.createElement('div');

	valEle.innerHTML = val;
	valEle.classList.add('jsonVal');
	valEle.classList.add(this.getPrimitiveClass(val));

	return valEle;
};

/* The `JSONViewer.prototype.addToggleListener` function is adding a click event listener to an HTML
element passed as an argument (`element`). When the element is clicked, the function toggles its
visibility by adding or removing the CSS classes `active` and `hidden`. If the element already has
the `active` class, it removes it and hides all child elements with the CSS class `jsonObj`. If the
element does not have the `active` class, it shows all child elements with the CSS class `jsonObj`
and adds the `active` class to the element. The `preventDefault` and `stopPropagation` methods are
used to prevent the default behavior of the click event and stop it from propagating to parent
elements. */
JSONViewer.prototype.addToggleListener = function (element) {
	element.addEventListener('click', function (e) {
		e.preventDefault();
		e.stopPropagation();

		if (this.classList.contains('active')) {
			const childObjElems = this.querySelectorAll('.jsonObj');
			childObjElems.forEach((child) => {
				child.classList.remove('active');
				child.classList.add('hidden');
			});
			this.classList.remove('active');
		} else {
			const childElems = this.children;

			Array.from(childElems).forEach((child) => {
				if (child.classList.contains('jsonObj')) {
					child.classList.remove('hidden');
				}
			});

			this.classList.add('active');
		}
	});
};

/* The `JSONViewer.prototype.formatObj` function is attempting to parse the `obj` argument as a JSON
string using `JSON.parse()`. If the parsing is successful, it returns the parsed JSON object. If the
parsing fails, it returns the original `obj` argument. This function is used to handle cases where
the input data may be either a JSON object or a JSON string. */
JSONViewer.prototype.formatObj = function (obj) {
	try {
		return JSON.parse(obj);
	} catch {
		return obj;
	}
};

/* The `JSONViewer.prototype.getPrimitiveClass` function is determining the appropriate CSS class to
add to an HTML element based on the type of the value passed as an argument (`val`). If the value is
`null` or the string `'null'`, it returns the string `'jsonNullVal'`. If the value is `'true'`,
`'false'`, or a boolean, it returns the string `'jsonBooleanVal'`. If the value is a number, it
returns the string `'jsonNumberVal'`. Otherwise, it returns the string `'jsonStringVal'`. These CSS
classes are used to style the HTML elements created by the `JSONViewer` function based on the type
of the JSON value they represent. */
JSONViewer.prototype.getPrimitiveClass = function (val) {
	if (val === null || val === 'null') {
		return 'jsonNullVal';
	}

	if (val === 'true' || val === 'false' || typeof val === 'boolean') {
		return 'jsonBooleanVal';
	}

	if (!isNaN(val)) {
		return 'jsonNumberVal';
	}

	return 'jsonStringVal';
};
