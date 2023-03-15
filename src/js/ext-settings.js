export function ExtSettings() {
    const savedSettings = this.getSavedSettings().then(data => data);
    this.settings = Object.assign(defaultSettings, savedSettings);
}

ExtSettings.prototype.updateSetting = function(key, value) {
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

ExtSettings.prototype.render() = function() {
    const root = document.querySelector(':root');
    const themeObject = Object.assign(
        themes[this.settings.extensionTheme],
        this.settings.customTheme
    );
    const codeThemeObject = Object.assign(
        codeThemes[this.settings.codeTheme],
        this.settings.customCodeTheme
    );

    Object.entries(themeObject).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });

    Object.entries(codeThemeObject).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });
}

ExtSettings.prototype.reset = function(...excluding) {
    const customThemeObject = Object.assign({}, this.settings.customTheme);
    const customCodeThemeObject = Object.assign({}, this.settings.customCodeTheme);

    Object.key(customThemeObject).forEach((prop) => {
        if (!excluding.includes(prop)) {
            delete customThemeObject[prop];
        }
    });

    Object.key(customCodeThemeObject).forEach((prop) => {
        if (!excluding.includes(prop)) {
            delete customCodeThemeObject[prop];
        }
    });

    this.settings.customTheme = Object.assign(
        this.settings.customTheme,
        customThemeObject
    );

    this.settings.customCodeTheme = Object.assign(
        this.settings.customCodeTheme,
        customCodeThemeObject
    );
}


export const defaultSettings = {
    extensionTheme: 'dark',
    codeTheme: 'dark',
    customTheme: themes.dark,
    customCodeTheme: codeThemes.dark,
}

export const themeFields = [
    'alertColor',
    'backgroundColor',
    'backgroundHoverColor',
    'borderColor',
    'buttonBackgroundColor',
    'buttonBorderColor',
    'buttonHoverBackgroundColor',
    'buttonHoverBorderColor',
    'buttonHoverTextColor',
    'buttonTextColor',
    'checkedColor',
    'textColor',
    'uncheckedColor',
];

export const codeThemeFields = [
    'jsonKey',
    'jsonNull',
    'jsonBoolean',
    'jsonString',
    'jsonNumber'
];

export const themes = {
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
        alertColor: '#503BFF',
        backgroundColor: '#F9F3F3',
        backgroundHoverColor: '#ccc5b9',
        borderColor: '#7868E6',
        buttonBackgroundColor: 'transparent',
        buttonBorderColor: '#343a40',
        buttonHoverBackgroundColor: 'transparent',
        buttonHoverBorderColor: '#7868E6',
        buttonHoverTextColor: '#7868E6',
        buttonTextColor: '#343a40',
        checkedColor: '#61B15A',
        textColor: '#343a40',
        uncheckedColor: '#FF3E6D'
    },
};

export const codeThemes = {
    dark: {
        jsonKey: '#AADAFA',
        jsonNull: '#A67E6B',
        jsonBoolean: '#6FBFF9',
        jsonString: '#A67E6B',
        jsonNumber: '#B2C4A4'
    },
    light: {
        jsonKey: '#943996',
        jsonNull: '#383A3C',
        jsonBoolean: '#986D25',
        jsonString: '#6C9F61',
        jsonNumber: '#986D25'
    }
};