import JSONViewer from '../utils/json-viewer.js';

const listEle = document.querySelector('.extUtil__tableList',);
const viewEle = document.querySelector('.extUtil__tableView',);

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

const tabby = await getCurrentTab();
console.log(tabby);

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
const a = await chrome.storage.session.get(["blah"]);
console.log(Object.keys(a));

const b = await chrome.storage.local.get(["blah"]);

const c = await chrome.storage.sync.get(["blah"]);

console.log(Object.keys(b));
console.log(Object.keys(c));


// chrome.storage.sync.get(null, function(items) {
//     var allKeys = Object.keys(items);
//     console.log(allKeys);
// });

// chrome.storage.session.get(null, function(items) {
//     var allKeys = Object.keys(items);
//     console.log(allKeys);
// });

// get session storage items from tab
const testData = [
    {
        "one": {
            "id": 1,
            "first_name": "Robert",
            "last_name": "Schwartz",
            "email": "rob23@gmail.com"
        }
    },
    {
        "two": {
            "id": 2,
            "first_name": "Lucy",
            "last_name": "Ballmer",
            "more": {
                "id": 1,
                "first_name": "Robert",
                "last_name": "Schwartz",
                "email": "rob23@gmail.com"
            },
            "email": "lucyb56@gmail.com"
        }
    },
    {
        "three": {
            "id": 3,
            "first_name": "Anna",
            "last_name": "Smith",
            "email": "annasmith23@gmail.com"
        }
    },
    {
        "four": {
            "id": 4,
            "first_name": "Robert",
            "last_name": "Brown",
            "email": "bobbrown432@yahoo.com"
        }
    },
    {
        "five": {
            "id": 5,
            "first_name": "Roger",
            "last_name": "Bacon",
            "email": "rogerbacon12@yahoo.com"
        }
    }
];

// for each item populate the list in the content
const ssItemElems = [];
testData.forEach((item, i) => {
    const itemEle = document.createElement('div');
    const id = Object.keys(item)[0];

    itemEle.classList.add('extUtil__ssItem');

    if (i == 0) {
        itemEle.classList.add('selected');
    }

    const inputEle = document.createElement('input');
    inputEle.type = 'checkbox';
    inputEle.id = id;
    inputEle.value = true;
    inputEle.checked = true;

    const labelEle = document.createElement('p');
    labelEle.innerHTML = id;

    itemEle.appendChild(inputEle);
    itemEle.appendChild(labelEle);
    listEle.appendChild(itemEle);

    ssItemElems.push(itemEle);
});

// iterate through ssItemElems to add click listener to update the 'selected' class
ssItemElems.forEach(ssItem => {
    const p = ssItem.querySelector('p');
    p.addEventListener('click', function (e) {
        e.preventDefault();

        const current = document.querySelector('.extUtil__ssItem.selected');
        const p = current.querySelector('p');

        if (e.target === p) {
            return;
        }

        current.classList.remove('selected');

        e.target.parentElement.classList.add('selected');
        updateJsonViewArea();
    });
});

updateJsonViewArea();

function updateJsonViewArea() {
    const currentSelection = document.querySelector('.extUtil__ssItem.selected');

    if (!currentSelection) {
        return;
    }

    const selectedInputEle = currentSelection.querySelector('input');

    if (!selectedInputEle) {
        return;
    }

    const dataKey = selectedInputEle.id;
    
    viewEle.innerHTML = "";

    testData.forEach(obj => {
        const key = Object.keys(obj)[0];
        
        if (dataKey === key) {
            new JSONViewer({data: obj[key], parentEle: viewEle})
        }
    });
}
