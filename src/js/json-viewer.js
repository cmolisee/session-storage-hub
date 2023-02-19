export default function JSONViewer(config,) {
    this.config = Object.assign({ data: {}, parentEle: null, }, config,);

    if (this.config.parentEle === null) {
        throw new Error('JSONViewer object requires the parentEle argument...',);
    }
    this.render();
}

JSONViewer.prototype.render = function () {
    const obj = this.config.data,
        parentEle = this.config.parentEle;

    this.parseToHtml(obj, parentEle,);
};

JSONViewer.prototype.parseToHtml = function (obj, element,) {
    const formatted = formatObj(obj,);

    if (Array.isArray(formatted)) {
        for (const item in formatted) {
            this.parseToHtml(childObj, keyEle,);
        }
    } else if (typeof formatted === 'object') {
        for (const [key, value] of Object.entries(formatted)) {
            const objEle = this.createObjEle();
            element.appendChild(objEle,);

            if (element === this.config.parentEle) {
                objEle.classList.remove('hidden',);
            }
            
            const keyEle = this.createKeyEle(key,);
            objEle.appendChild(keyEle,);

            this.parseToHtml(value, objEle,);
        }
    } else {
        element.appendChild(this.createValueEle(formatted || 'null',),);
    }
};

JSONViewer.prototype.createObjEle = function () {
    const jsonObjEle = document.createElement('div',);

    jsonObjEle.classList.add('jsonObj',);
    jsonObjEle.classList.add('hidden',);
    this.addToggleListener(jsonObjEle,);

    return jsonObjEle;
};

JSONViewer.prototype.createKeyEle = function (key,) {
    const keyEle = document.createElement('div',);

    keyEle.innerHTML = key;
    keyEle.classList.add('jsonKey',);

    return keyEle;
};

JSONViewer.prototype.createValueEle = function (val,) {
    const valEle = document.createElement('div',);

    valEle.innerHTML = val;
    valEle.classList.add('jsonVal',);

    return valEle;
};

JSONViewer.prototype.addToggleListener = function (element,) {
    element.addEventListener('click', function (e,) {
        e.preventDefault();
        e.stopPropagation();

        if (this.classList.contains('active',)) {
            const childObjElems = this.querySelectorAll('.jsonObj',);
            childObjElems.forEach((child,) => {
                child.classList.remove('active',);
                child.classList.add('hidden',);
            },);
            this.classList.remove('active',);
        } else {
            const keyEle = this.querySelector('.jsonKey',);

            if (!keyEle) {
                return;
            }

            const immediateChildElems = keyEle.children;
            Array.from(immediateChildElems,).forEach((child,) => {
                return child.classList.remove('hidden',);
            },);
            this.classList.add('active',);
        }
    },);
};

function formatObj(obj,) {
    try {
        return JSON.parse(obj);
    } catch {
        return obj;
    }
}
