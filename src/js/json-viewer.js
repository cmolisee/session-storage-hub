export default function JSONViewer(config) {
    this.config = Object.assign({ data: {}, parentEle: null, }, config);

    if (this.config.parentEle === null) {
        throw new Error('JSONViewer object requires the parentEle argument...');
    }
    this.render();
}

JSONViewer.prototype.render = function () {
    const obj = this.config.data;
    const parentEle = this.config.parentEle;

    this.parseToHtml(obj, parentEle);
};

JSONViewer.prototype.parseToHtml = function (obj, element) {
    const formatted = this.formatObj(obj);

    if (Array.isArray(formatted)) {
        for (const item of formatted) {
            const arrayWrapper = this.createArrayWrapper();
            element.appendChild(arrayWrapper);

            this.parseToHtml(item, arrayWrapper);
        }
    } else if (formatted !== null && typeof formatted === 'object') {
        for (const [ key, value, ] of Object.entries(formatted)) {
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

JSONViewer.prototype.createObjWrapper = function () {
    const jsonObjEle = document.createElement('div');

    jsonObjEle.classList.add('jsonObj');
    jsonObjEle.classList.add('hidden');
    this.addToggleListener(jsonObjEle);

    return jsonObjEle;
};

JSONViewer.prototype.createArrayWrapper = function () {
    const jsonObjEle = document.createElement('div');

    jsonObjEle.classList.add('jsonArray');

    return jsonObjEle;
};

JSONViewer.prototype.createKeyEle = function (key) {
    const keyEle = document.createElement('div');

    keyEle.innerHTML = key;
    keyEle.classList.add('jsonKey');

    return keyEle;
};

JSONViewer.prototype.createValueEle = function (val) {
    const valEle = document.createElement('div');

    valEle.innerHTML = val;
    valEle.classList.add('jsonVal');
    valEle.classList.add(this.getPrimitiveClass(val));

    return valEle;
};

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

JSONViewer.prototype.formatObj = function (obj) {
    try {
        return JSON.parse(obj);
    } catch {
        return obj;
    }
};

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
