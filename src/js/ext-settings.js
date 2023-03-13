export default function ExtSettings() {
    const savedSettings = this.getSavedSettings().then(data => data);

    this.settings = Object.assign({
        extensionTheme: 'dark',
        codeTheme: 'dark',
        customTheme: {
            alertColor: '',
            backgroundColor: '',
            backgroundHoverColor: '',
            borderColor: '',
            buttonBackgroundColor: '',
            buttonBorderColor: '',
            buttonHoverBackgroundColor: '',
            buttonHoverBorderColor: '',
            buttonHoverTextColor: '',
            buttonTextColor: '',
            checkedColor: '',
            textColor: '',
            uncheckedColor: ''
        },
        customCodeTheme: {
            jsonKey: '',
            jsonNull: '',
            jsonBoolean: '',
            jsonString: '',
            jsonNumber: ''
        }
    }, savedSettings);
}

ExtSettings.prototype.update = function(key, value) {
    if (this.settings.hasOwnProperty(key)) {
        this.settings[key] = value;
    }
}

ExtSettings.prototype.getSavedSettings = async function() {
    return await chrome.storage.sync.get('settings');
}

ExtSettings.prototype.saveCurrentSettings = function() {
    chrome.storage.sync.set(this.settings);
}

ExtSettings.prototype.updateStyles = function() {
    const root = document.querySelector(':root');
    const themeObject = themes[this.settings.extensionTheme];
    const codeThemeObject = codeThemes[this.settings.codeTheme];

    Object.entries(themeObject).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });

    Object.entries(codeThemeObject).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });
}

const themes = {
    dark: {
        alertColor: '#f46036',
        backgroundColor: '#403d39',
        backgroundHoverColor: '#ccc5b9',
        borderColor: '#ccc5b9',
        buttonBackgroundColor: 'transparent',
        buttonBorderColor: '#ccc5b9',
        buttonHoverBackgroundColor: 'transparent',
        buttonHoverBorderColor: '#f46036',
        buttonHoverTextColor: '#f46036',
        buttonTextColor: '#ccc5b9',
        checkedColor: '#008000',
        textColor: '#ccc5b9',
        uncheckedColor: '#d90429'
    },
    light: {
        alertColor: '#f46036',
        backgroundColor: '#403d39',
        backgroundHoverColor: '#ccc5b9',
        borderColor: '#ccc5b9',
        buttonBackgroundColor: 'transparent',
        buttonBorderColor: '#ccc5b9',
        buttonHoverBackgroundColor: 'transparent',
        buttonHoverBorderColor: '#f46036',
        buttonHoverTextColor: '#f46036',
        buttonTextColor: '#ccc5b9',
        checkedColor: '#008000',
        textColor: '#ccc5b9',
        uncheckedColor: '#d90429'
    },
};

const codeThemes = {
    dark: {
        jsonKey: '',
        jsonNull: '',
        jsonBoolean: '',
        jsonString: '',
        jsonNumber: ''
    },
    light: {
        jsonKey: '',
        jsonNull: '',
        jsonBoolean: '',
        jsonString: '',
        jsonNumber: ''
    }
}