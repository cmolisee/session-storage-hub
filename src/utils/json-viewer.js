// create script for viewing a json object in html

// string
// int
// boolean

// key
// value

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
    for (var key in obj) {
        const objEle = this.createObjEle();
        element.appendChild(objEle);

        if (element === this.config.parentEle) {
            objEle.classList.remove('hidden');
        }

        const keyEle = this.createKeyEle(key,);
        objEle.appendChild(keyEle,);

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            this.recursiveParse(obj[key], keyEle,);
        } else {
            objEle.appendChild(this.createValueEle(obj[key] || "null",),);
        }
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
            const immediateChildElems = this.querySelector('.jsonKey').children;
            Array.from(immediateChildElems).forEach(child => child.classList.remove('hidden'));
            this.classList.add('active');
        }
    });
};