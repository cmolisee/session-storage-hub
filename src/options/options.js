import { codeThemeFields, codeThemes, themeFields, themes } from '../js/ext-settings.js';

document.addEventListener('DOMContentLoaded', init());

function init() {
    const extensionThemeSelector = document.querySelector('#extensionTheme');
    const codeThemeSelector = document.querySelector('#codeTheme');

    Object.keys(themes).forEach((theme) => {
        const option = document.createElement('option');
        option.value = theme;
        option.innerText = theme;

        extensionThemeSelector.appendChild(option);
    });

    Object.keys(codeThemes).forEach((theme) => {
        const option = document.createElement('option');
        option.value = theme;
        option.innerText = theme;

        codeThemeSelector.appendChild(option);
    });

    const customThemeOptions = document.querySelector('#customThemeOptions');
    const customCodeThemeOptions = document.querySelector('#customCodeThemeOptions');

    themeFields.forEach((field) => {
        customThemeOptions.appendChild(buildColorOptionFields(
            field,
            '#000000'
        ));
    });

    codeThemeFields.forEach((field) => {
        customCodeThemeOptions.appendChild(buildColorOptionFields(
            field,
            '#000000'
        ));
    });
}

function buildColorOptionFields(fieldName, defaultValue) {
    const optionContainer = document.createElement('div');
    optionContainer.classList.add('optionContainer');

    const label = document.createElement('label');
    label.setAttribute('for', fieldName);
    label.innerText = fieldName;

    const toggleInput = document.createElement('input');
    toggleInput.setAttribute('type', 'checkbox');
    toggleInput.setAttribute('id', `enable-${fieldName}`);
    // toggleInput.setAttribute('value', false);

    const colorInput = document.createElement('input');
    colorInput.setAttribute('type', 'color');
    colorInput.setAttribute('id', fieldName);
    colorInput.setAttribute('name', fieldName);
    colorInput.setAttribute('value', defaultValue);
    colorInput.setAttribute('disabled', true);
    
    const textInput = document.createElement('input');
    textInput.classList.add('hexVal');
    textInput.setAttribute('value', colorInput.value);
    textInput.setAttribute('pattern', '#[0-9A-Fa-f]{6}')
    textInput.setAttribute('disabled', true);

    toggleInput.addEventListener('change', function (e) {
        if (e.target.checked) {
            colorInput.removeAttribute('disabled');
            textInput.removeAttribute('disabled');
        } else {
            colorInput.setAttribute('disabled', true);
            textInput.setAttribute('disabled', true);
        }
    });

    textInput.addEventListener('input', function (e) {
        if (e.target.validity.valid) {
            colorInput.setAttribute('value', e.target.value);
        }
    });

    colorInput.addEventListener('change', function (e) {
        textInput.setAttribute('value', e.target.value);
    });

    optionContainer.appendChild(label);
    optionContainer.appendChild(toggleInput);
    optionContainer.appendChild(colorInput);
    optionContainer.appendChild(textInput);

    return optionContainer;
}













// (function() {
    

//     const themes = {};

//     const themeFields = [
//         'alertColor',
//         'backgroundColor',
//         'backgroundHoverColor',
//         'borderColor',
//         'buttonBackgroundColor',
//         'buttonBorderColor',
//         'buttonHoverBackgroundColor',
//         'buttonHoverBorderColor',
//         'buttonHoverTextColor',
//         'buttonTextColor',
//         'checkedColor',
//         'textColor',
//         'uncheckedColor',
//     ];
    
//     const codeThemeFields = [
//         'jsonKey',
//         'jsonNull',
//         'jsonBoolean',
//         'jsonString',
//         'jsonNumber'
//     ];
// })();