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

    console.log(obj,);
    console.log(parentEle,);
    // this.recursiveParse(obj, parentEle);
};

JSONViewer.prototype.recursiveParse = function (obj, element,) {
    const jsonObjEle = document.createElement('div',);
    jsonObjEle.classList.add('jsonObj',);
    element.appendChild(jsonObjEle,);

    for (var key in obj) {
        const keyEle = this.createKeyEle(key,);
        jsonObjEle.appendChild(keyEle,);

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            this.recursiveParse(obj[key], keyEle,);
        } else {
            keyEle.appendChild(this.createValueEle(obj[key],),);
        }
    }
};

JSONViewer.prototype.createKeyEle = function (val,) {
    const keyEle = document.createElement('div',);

    keyEle.innerHTML = val;
    keyEle.classList.add('jsonKey',);

    return keyEle;
};

JSONViewer.prototype.createValueEle = function (val,) {
    const valEle = document.createElement('div',);

    valEle.innerHTML = val;
    valEle.classList.add('jsonVal',);

    return valEle;
};

// handle arrays
// toggle value - adds event listener to toggle the value
