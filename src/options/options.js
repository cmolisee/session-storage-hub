import { codeThemes, ExtSettings, themes, deepClone } from '../js/ext-settings.js';

const extSettings = new ExtSettings();
document.addEventListener('DOMContentLoaded', init());

function init() {
    initSelectorOptions();
    buildOptionFields();
    configureStickyControls();
    
    extSettings.render();  
}

function initSelectorOptions() {
    const extensionThemeSelector = document.querySelector('#extensionTheme');
    const codeThemeSelector = document.querySelector('#codeTheme');

    buildOptions(themes, extensionThemeSelector);
    buildOptions(codeThemes, codeThemeSelector);

    extensionThemeSelector.value = extSettings.settings.extensionTheme;
    codeThemeSelector.value = extSettings.settings.codeTheme;

    extensionThemeSelector.addEventListener('change', function (e) {
        extSettings.update('extensionTheme', e.target.value);
        updateColorOptionFields();
        extSettings.render(getActiveCustomThemes()); // pass the active theme keys
    });

    codeThemeSelector.addEventListener('change', function (e) {
        extSettings.update('codeTheme', e.target.value);
        updateColorOptionFields();
        extSettings.render(); // pass the active code theme keys
    });
}

function buildOptions(themes, elem) {
    Object.keys(themes).forEach((theme) => {
        const option = document.createElement('option');
        option.value = theme;
        option.innerText = theme;

        elem.appendChild(option);
    });
}

function buildOptionFields() {
    const customThemeOptions = document.querySelector('#customThemeOptions');
    const customCodeThemeOptions = document.querySelector('#customCodeThemeOptions');
    const extensionThemeObject = themes[extSettings.settings.extensionTheme];
    const codeThemeObject = codeThemes[extSettings.settings.codeTheme];

    Object.keys(extensionThemeObject).forEach((field) => {
        let value = extensionThemeObject[field];

        customThemeOptions.appendChild(buildColorOptionFields(
            field,
            value === 'transparent' ? extensionThemeObject.backgroundColor : value
        ));
    });

    Object.keys(codeThemeObject).forEach((field) => {
        let value = codeThemeObject[field];

        customCodeThemeOptions.appendChild(buildColorOptionFields(
            field,
            value === 'transparent' ? codeThemeObject.backgroundColor : value
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
        // TOOD: Ensure enabling field properly updateds and renders color
        if (e.target.checked) {
            colorInput.removeAttribute('disabled');
            textInput.removeAttribute('disabled');
        } else {
            colorInput.setAttribute('disabled', true);
            textInput.setAttribute('disabled', true);

            const defaultValue = extSettings.getPresetValue(fieldName);
            
            extSettings.update(fieldName, defaultValue, true);
            extSettings.render();
        }
    });

    textInput.addEventListener('input', function (e) {
        if (e.target.validity.valid) {
            colorInput.setAttribute('value', e.target.value);
            extSettings.updateSetting(colorInput.id, e.target.value, true);
            extSettings.render();
        }
    });

    colorInput.addEventListener('change', function (e) {
        textInput.setAttribute('value', e.target.value);
        extSettings.updateSetting(colorInput.id, e.target.value, true);
        extSettings.render();
    });

    optionContainer.appendChild(label);
    optionContainer.appendChild(toggleInput);
    optionContainer.appendChild(colorInput);
    optionContainer.appendChild(textInput);

    return optionContainer;
}

function updateColorOptionFields() {
    // get all active toggles
    // map to fieldNames for active toggles
    // reset all the custom fields to the preset values unless they are in an active state
    // update all the custom fields
    console.log(defaultSettings);
    const allToggles = document.querySelectorAll('input[type="checkbox"]');
    const excludeFieldNames = [...allToggles].filter((toggle) => {
        if (toggle.checked === true) {
            const colorInput = toggle.parentElement.querySelector('input[type="color"]');
            return colorInput.id;
        }
    });

    console.log(allToggles.length);
    console.log(excludeFieldNames);
    extSettings.reset(...excludeFieldNames);

    console.log(extSettings.settings);
    allToggles.forEach((toggle) => {
        const colorInput = toggle.parentElement.querySelector('input[type="color"]');
        const textInput = toggle.parentElement.querySelector('input[type="color"]');
        let preset = extSettings.getPresetValue(colorInput.id);

        if (preset === 'transparent') {
            preset = extSettings.getPresetValue('backgroundColor');
        }

        colorInput.setAttribute('value', preset);
        textInput.setAttribute('value', preset);
    });
}

function configureStickyControls() {
    const stickyControls = document.querySelector('.controls');
    const height = stickyControls.clientHeight;

    const placeholder = document.createElement('div');
    placeholder.style.cssText = `height: ${height}px; width: 100%;`;

    stickyControls.parentNode.insertBefore(placeholder, stickyControls.nextSibling);
}

function getActiveCustomThemes() {
    const activeColorProperties = document.querySelectorAll('input[type="checkbox"]:checked + input[type="color"]');

    if (!activeColorProperties.length) {
        return null;
    }

    const customThemeClone = extSettings.deepClone(themes[extSettings.settings.extensionTheme]);
    const customCodeThemeClone = extSettings.deepClone(codeThemes[extSettings.settings.codeTheme]);

    activeColorProperties.forEach((elem) => {
        const colorInput = elem.parentElement.querySelector('input[type="color"]');
        const prop = colorInput.id;

        if (customThemeClone.hasOwnProperty(prop)) {
            customThemeClone[prop] = colorInput.value;
        }

        if (customCodeThemeClone.hasOwnProperty(prop)) {
            customCodeThemeClone[prop] = colorInput.value;
        }
    })

    return { customTheme: customThemeClone, customCodeTheme: customCodeThemeClone };
}