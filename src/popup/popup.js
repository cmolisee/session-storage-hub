import JSONViewer from '../utils/json-viewer.js';

const listEle = document.querySelector('.extUtil__tableList',);
const viewEle = document.querySelector('.extUtil__tableView',);

// get session storage items from tab
const testSSItems = [
    ssItemOne: {
        example1: [
            {
                name: "test01",
                age: 18,
                gender: 0,
                student: true,
                children: null
            },
            {
                name: "test02",
                age: 19,
                gender: 1,
                student: true,
                children: null
            }
        ],
        example2: {
            fruits: ["apple", "grape", "jujube", "pear"],
            transport: ["taxi", "bus", "metro", "plane", "train"]
        }
    },
    ssItemTwo: {
        example1: [
            {
                name: "test01",
                age: 18,
                gender: 0,
                student: true,
                children: null
            },
            {
                name: "test02",
                age: 19,
                gender: 1,
                student: true,
                children: null
            }
        ],
        example2: {
            fruits: ["apple", "grape", "jujube", "pear"],
            transport: ["taxi", "bus", "metro", "plane", "train"]
        }
    },
    ssItemThree: {
        example1: [
            {
                name: "test01",
                age: 18,
                gender: 0,
                student: true,
                children: null
            },
            {
                name: "test02",
                age: 19,
                gender: 1,
                student: true,
                children: null
            }
        ],
        example2: {
            fruits: ["apple", "grape", "jujube", "pear"],
            transport: ["taxi", "bus", "metro", "plane", "train"]
        }
    }
];

// for each item populate the list in the content
const ssItemElems = [];
testSSItems.forEach((item, i) => {
    const itemEle = document.createElement('div');
    itemEle.classList.add('extUtil__ssItem');

    if (i == 0) {
        itemEle.classList.add('selected');
    }

    const inputEle = document.createElement('input');
    inputEle.type = 'checkbox';
    inputEle.id = '';//name of item
    inputEle.value = true;
    inputEle.checked = true;

    const labelEle = document.createElement('label');
    labelEle.for = ''; //name of item
    labelEle.innerHTML = ''; //name of item

    itemEle.appendChild(inputEle);
    itemEle.appendChild(labelEle);
    listEle.appendChild(itemEle);

    ssItemElems.push(itemEle);
});

// iterate through ssItemElems to add click listener to update the 'selected' class
// whichever class is selected call the JSONViewer vvv

new JSONViewer({ data: JSON.parse(testJson), parentEle: viewEle });
