export default function JSONViewer(config,) {
    this.config = Object.assign({ data: {}, parentEle: null, }, config,);

    if (this.config.parentEle === null) {
        throw new Error('JSONViewer object requires the parentEle argument...',);
    }
    this.render();
}

JSONViewer.prototype.render = function () {
    const obj = this.config.data;
    const parentEle = this.config.parentEle;

    this.recursiveParse(obj, parentEle);
};

JSONViewer.prototype.recursiveParse = function (obj, element,) {
    var parsed = parseObject(obj);

    if (Array.isArray(parsed)) {
        const objEle = this.createObjEle();
        element.appendChild(objEle);

        if (element === this.config.parentEle) {
            objEle.classList.remove('hidden');
        }

        if (typeof obj[0] === 'object') {
            obj.forEach((childObj) => {
                this.recursiveParse(childObj, keyEle);
            });
        } else {
            obj.forEach((item) => {
                objEle.appendChild(this.createValueEle(item || "null",),);
            });
        }
    } else if (typeof parsed === 'object') {
        for (var key in parsed) {
            const objEle = this.createObjEle();
            element.appendChild(objEle);
    
            if (element === this.config.parentEle) {
                objEle.classList.remove('hidden');
            }
    
            const keyEle = this.createKeyEle(key,);
            objEle.appendChild(keyEle,);
    
            if (typeof parsed[key] === 'object' && parsed[key] !== null) {
                this.recursiveParse(parsed[key], keyEle,);
            } else {
                objEle.appendChild(this.createValueEle(parsed[key] || "null",),);
            }
        }
    } else { // primitive
        const objEle = this.createObjEle();
        element.appendChild(objEle);

        if (element === this.config.parentEle) {
            objEle.classList.remove('hidden');
        }

        objEle.appendChild(this.createValueEle(obj || "null",),);
    }
};

JSONViewer.prototype.createObjEle = function () {
    const jsonObjEle = document.createElement('div',);

    jsonObjEle.classList.add('jsonObj',);
    jsonObjEle.classList.add('hidden');
    this.addToggleListener(jsonObjEle);
    
    return jsonObjEle;
}

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
            const keyEle = this.querySelector('.jsonKey');

            if (!keyEle) {
                return;
            }

            const immediateChildElems = keyEle.children;
            Array.from(immediateChildElems).forEach(child => child.classList.remove('hidden'));
            this.classList.add('active');
        }
    });
};

function parseObject(obj) {
    try {
        return JSON.parse(obj);
    } catch {
        return obj;
    }
}