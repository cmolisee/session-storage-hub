import JSONViewer from '../utils/json-viewer.js';

console.log('it is working...',);

// const buttonEle = document.querySelector('button.btn--toggle',),
//  contentEle = document.querySelector('.extUtil__tabItemContent',),
const viewEle = document.querySelector('.extUtil__tableView',);

// buttonEle.addEventListener('click', function () {
//     if (window.getComputedStyle(contentEle,).display === 'none') {
//         contentEle.style.display = 'block';
//     } else {
//         contentEle.style.display = 'none';
//     }
// },);

const testJson = `{
"example1": [
    {
        "name": "test01",
        "age": 18,
        "gender": 0,
        "student": true,
        "children": null
    },
    {
        "name": "test02",
        "age": 19,
        "gender": 1,
        "student": true,
        "children": null
    }
],
"example2": {
    "friuts": ["apple", "grape", "jujube", "pear"],
    "transport": ["taxi", "bus", "metro", "plane", "train"]
}
}`;

new JSONViewer({ data: JSON.parse(testJson), parentEle: viewEle });
