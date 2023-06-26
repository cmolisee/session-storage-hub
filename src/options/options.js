document.addEventListener('DOMContentLoaded', init);
const extensionThemeSelector = document.getElementById('extensionThemeOption');
const codeThemeSelector = document.getElementById('codeThemeOption');

/**
 * The function initializes event listeners and populates select fields for saving and resetting
 * options.
 */
function init() {
	const saveButtonEle = document.getElementById('saveButton');
	const resetButtonEle = document.getElementById('resetButton');

	if (saveButtonEle) {
		saveButtonEle.addEventListener('click', saveOptions);
	}

	if (resetButtonEle) {
		resetButtonEle.addEventListener('click', resetOptions);
	}

	if (extensionThemeSelector || codeThemeSelector) {
		populateSelectFields();
		resetOptions();
	}
}

/**
 * This function populates two select fields with options based on the keys of two objects.
 */
function populateSelectFields() {
	Object.keys(extensionThemes).forEach((key) => {
		const optionEle = document.createElement('option');
		optionEle.value = key;
		optionEle.innerText = key;

		extensionThemeSelector.appendChild(optionEle);
	});

	Object.keys(codeThemes).forEach((key) => {
		const optionEle = document.createElement('option');
		optionEle.value = key;
		optionEle.innerText = key;

		codeThemeSelector.appendChild(optionEle);
	});
}

/**
 * This function saves the selected options for the extension and code themes in Chrome storage and
 * updates the root styles accordingly.
 */
function saveOptions() {
	const extensionThemeOption = document.getElementById(
		'extensionThemeOption'
	).value;
	const codeThemeOption = document.getElementById('codeThemeOption').value;

	chrome.storage.sync.set(
		{ extensionTheme: extensionThemeOption, codeTheme: codeThemeOption },
		() => {
			updateRootStyles(extensionThemeOption, codeThemeOption);
		}
	);
}

/**
 * The function resets options by retrieving default settings and updating root styles.
 */
function resetOptions() {
	chrome.storage.sync.get(defaultSettings, (settings) => {
		updateRootStyles(settings.extensionTheme, settings.codeTheme);
	});
}

/**
 * This function updates the root styles of a webpage based on the selected extension and code themes.
 * @param extensionTheme - The selected theme for the browser extension.
 * @param codeTheme - The code theme is a string that represents the selected theme for the code
 * editor. It is used to retrieve the corresponding object of CSS variables for that theme from the
 * `codeThemes` object.
 */
export function updateRootStyles(extensionTheme, codeTheme) {
	const extensionThemeSelector = document.getElementById(
		'extensionThemeOption'
	);
	const codeThemeSelector = document.getElementById('codeThemeOption');
	const extensionThemeObject = extensionThemes[extensionTheme];
	const codeThemeObject = codeThemes[codeTheme];

	Object.entries(extensionThemeObject).forEach(([key, value]) => {
		document.body.style.setProperty(`--${key}`, value);
	});

	Object.entries(codeThemeObject).forEach(([key, value]) => {
		document.body.style.setProperty(`--${key}`, value);
	});

	if (extensionThemeSelector) {
		extensionThemeSelector.value = extensionTheme;
	}

	if (codeThemeSelector) {
		codeThemeSelector.value = codeTheme;
	}
}

export const extensionThemes = {
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
		uncheckedColor: '#d90429',
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
		uncheckedColor: '#FF3E6D',
	},
};

export const codeThemes = {
	dark: {
		jsonKey: '#AADAFA',
		jsonNull: '#A67E6B',
		jsonBoolean: '#6FBFF9',
		jsonString: '#A67E6B',
		jsonNumber: '#B2C4A4',
	},
	light: {
		jsonKey: '#943996',
		jsonNull: '#383A3C',
		jsonBoolean: '#986D25',
		jsonString: '#6C9F61',
		jsonNumber: '#986D25',
	},
};

export const defaultSettings = {
	extensionTheme: 'dark',
	codeTheme: 'dark',
	customTheme: extensionThemes.dark,
	customCodeTheme: codeThemes.dark,
};
