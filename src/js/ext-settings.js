export async function ExtSettings() {
    const data = await this.load();
    this.settings = deepClone(data);
}

ExtSettings.prototype.load = async function () {
    const data = await chrome.storage.sync.get('settings');
    return await data;
}

ExtSettings.prototype.save = function() {
    chrome.storage.sync.set(this.settings);
}

ExtSettings.prototype.render = function (settingOverrides) {
    const root = document.querySelector(':root');

    const customthemeSettings = settingOverrides && settingOverrides.customTheme ? 
        settingOverrides.customTheme : 
        themes[this.settings.extensionTheme];
    const customCodeThemeSettings = settingOverrides && settingOverrides.customCodeTheme ? 
        settingOverrides.customCodeTheme : 
        codeThemes[this.settings.codeTheme];

    const themeObject = deepClone(themes[this.settings.extensionTheme]);
    Object.assign(themeObject, customthemeSettings);
    Object.entries(themeObject).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });

    const codeThemeObject = deepClone(codeThemes[this.settings.codeTheme]);
    Object.assign(codeThemeObject, customCodeThemeSettings);
    Object.entries(codeThemeObject).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });
}

ExtSettings.prototype.update = function (key, value, isCustom = false) {
    if (!isCustom && this.settings.hasOwnProperty(key)) {
        this.settings[key] = value;
    }

    if (this.settings.customTheme.hasOwnProperty(key)) {
        this.settings.customTheme[key] = value;
    }

    if (this.settings.customCodeTheme.hasOwnProperty(key)) {
        this.settings.customCodeTheme[key] = value;
    }
}

ExtSettings.prototype.reset = function (...excluding) {
    const customThemeObject = deepClone(this.settings.customTheme);
    const customCodeThemeObject = deepClone(this.settings.customCodeTheme);
    const themePreset = deepClone(themes[this.settings.extensionTheme]);
    const codePreset = deepClone(codeThemes[this.settings.codeTheme]);

    Object.keys(customThemeObject).forEach((prop) => {
        if (excluding.includes(prop)) {
            delete customThemeObject[prop];
        }
    });

    Object.keys(customCodeThemeObject).forEach((prop) => {
        if (excluding.includes(prop)) {
            delete customCodeThemeObject[prop];
        }
    });

    this.settings.customTheme = Object.assign(
        themePreset,
        customThemeObject
    );

    this.settings.customCodeTheme = Object.assign(
        codePreset,
        customCodeThemeObject
    );
}

ExtSettings.prototype.getPresetValue = function (property) {
    const themePreset = themes[this.settings.extensionTheme];
    const codeThemePreset = codeThemes[this.settings.codeTheme];

    if (themePreset.hasOwnProperty(property)) {
        return themePreset[property];
    }
    
    if (codeThemePreset.hasOwnProperty(property)) {
        return codeThemePreset[property];
    }

    return null;
}

export function deepClone (obj) {
    if (obj === null) {
        return null;
    }
    
    const clone = Object.assign({}, obj);
    Object.keys(clone).forEach((key) => {
        clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    });

    if (Array.isArray(obj)) {
      clone.length = obj.length;
      return Array.from(clone);
    }

    return clone;
};

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

export const defaultSettings = {
    extensionTheme: 'dark',
    codeTheme: 'dark',
    customTheme: themes.dark,
    customCodeTheme: codeThemes.dark,
}