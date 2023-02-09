// create script for viewing a json object in html

// string
// int
// boolean

// key
// value


function JSONViewer (data, parentEle) {
    if (!parentElement) throw new Error('JSONViewer object requires the parentEle argument...');

    this.data = data || {};
    this.parentEle = parentEle
    this.render();
}

JSONViewer.prototype.render = function () {
    const obj = this.data


    // recursive iteration

    // for each item
        // recursively render the key then value
}

JSONViewer.prototype.recursiveParse = function (obj, element) {
    for (var key in obj) {
        // create the element for key
        // add the key to the element
        
        // if value is an object do this
        if (typeof obj[key] == "object" && obj[key] !== null) {
            this.recursiveParse(obj[key]);
        } else {
            // create the object for the value
            // add the value to the element
        }
    }
}

JSONViewer.prototype.createKeyEle = function (val) {
    // create key element from val
    // might need extra argument for handling the toggle of the element
}

JSONViewer.prototype.createValueEle = function (val) {
    // create value element from val
    // might need extra argument for handling the toggle of the element
}

// toggle value - adds event listener to toggle the value