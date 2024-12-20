import { andromeda } from "@uiw/codemirror-theme-andromeda";
import { bespin } from "@uiw/codemirror-theme-bespin";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import { AVAILABLE_THEMES } from "./constants";

/**
 * Mapping of themes to their corresponding css properties.
 */
export const themeOptions = [
	{
		"name": "light",
		"colors": {
			"backgroundColor": "#fff",
			"textColor": "#24292e",
			"specialTextColor": "#6f42c1",
			"buttonColor": "#6e7781",
			"buttonHoverColor": "#6f42c1",
			"borderColor": "#24292e",
			"selectedIconColor": "#116329",
			"unselectedIconColor": "#cb2431",
			"keyColor": "#24292e",
			"keySelectedColor": "#BBDFFF",
			"toastify-info": "#032f62",
			"toastify-success": "#116329",
			"toastify-warning": "#e36209",
			"toastify-error": "#cb2431",
			"toastify-background": "#fff",
			"toastify-text-color-info": "#fff",
			"toastify-text-color-success": "#fff",
			"toastify-text-color-warning": "#fff",
			"toastify-text-color-error": "#fff",
			"toastify-text-color-light": "#24292e",
			"toastify-color-light": "#fff"
		}
	},
	{
		"name": "dark",
		"colors": {
			"backgroundColor": "#1e1e1e",
			"textColor": "#6a9955",
			"specialTextColor": "#72a1ff",
			"buttonColor": "#6a9955",
			"buttonHoverColor": "#72a1ff",
			"borderColor": "#72a1ff",
			"selectedIconColor": "#4ec9b0",
			"unselectedIconColor": "#ce9178",
			"keyColor": "#6a9955",
			"keySelectedColor": "#d4d4d4",
			"toastify-info": "#569cd6",
			"toastify-success": "#4ec9b0",
			"toastify-warning": "#ce9178",
			"toastify-error": "#C586C0",
			"toastify-background": "#1e1e1e",
			"toastify-text-color-info": "#1e1e1e",
			"toastify-text-color-success": "#1e1e1e",
			"toastify-text-color-warning": "#1e1e1e",
			"toastify-text-color-error": "#1e1e1e",
			"toastify-text-color-light": "#6a9955",
			"toastify-color-light": "#1e1e1e"
		}
	},
	{
		"name": "tokyo-night",
		"colors": {
			"backgroundColor": "#24283b",
			"textColor": "#7982a9",
			"specialTextColor": "#89ddff",
			"buttonColor": "#c0caf5",
			"buttonHoverColor": "#89ddff",
			"borderColor": "#7982a9",
			"selectedIconColor": "#9ece6a",
			"unselectedIconColor": "#ff5370",
			"keyColor": "#7982a9",
			"keySelectedColor": "#D9DBE7",
			"toastify-info": "#bb9af7",
			"toastify-success": "#9ece6a",
			"toastify-warning": "#f7b79a",
			"toastify-error": "#F5C1E5",
			"toastify-background": "#24283b",
			"toastify-text-color-info": "#7982a9",
			"toastify-text-color-success": "#7982a9",
			"toastify-text-color-warning": "#7982a9",
			"toastify-text-color-error": "#7982a9",
			"toastify-text-color-light": "#24283b",
			"toastify-color-light": "#7982a9"
		}
	},
	{
		"name": "noctis-light",
		"colors": {
			"backgroundColor": "#f2f1f8",
			"textColor": "#0c006b",
			"specialTextColor": "#fa8900",
			"buttonColor": "#5c49e9",
			"buttonHoverColor": "#fa8900",
			"borderColor": "#160679",
			"selectedIconColor": "#00b368",
			"unselectedIconColor": "#e64100",
			"keyColor": "#0c006b",
			"keySelectedColor": "#fa8900",
			"toastify-info": "#9995b7",
			"toastify-success": "#00b368",
			"toastify-warning": "#b3694d",
			"toastify-error": "#B34D75",
			"toastify-background": "#f2f1f8",
			"toastify-text-color-info": "#0c006b",
			"toastify-text-color-success": "#0c006b",
			"toastify-text-color-warning": "#0c006b",
			"toastify-text-color-error": "#0c006b",
			"toastify-text-color-light": "#0c006b",
			"toastify-color-light": "#9995b7"
		}
	},
	{
		"name": "bespin",
		"colors": {
			"backgroundColor": "#28211c",
			"textColor": "#cf7d34",
			"specialTextColor": "#f9ee98",
			"buttonColor": "#cf6a4c",
			"buttonHoverColor": "#f9ee98",
			"borderColor": "#937121",
			"selectedIconColor": "#54be0d",
			"unselectedIconColor": "#BF1F0D",
			"keyColor": "#cf7d34",
			"keySelectedColor": "#f9ee98",
			"toastify-info": "#5ea6ea",
			"toastify-success": "#54be0d",
			"toastify-warning": "#EAD05D",
			"toastify-error": "#BF1F0D",
			"toastify-background": "#28211c",
			"toastify-text-color-info": "#28211c",
			"toastify-text-color-success": "#28211c",
			"toastify-text-color-warning": "#28211c",
			"toastify-text-color-error": "#28211c",
			"toastify-text-color-light": "#28211c",
			"toastify-color-light": "#797977"
		}
	},
	{
		"name": "andromeda",
		"colors": {
			"backgroundColor": "#23262E",
			"textColor": "#ee5d43",
			"specialTextColor": "#00e8c6",
			"buttonColor": "#ee5d43",
			"buttonHoverColor": "#00e8c6",
			"borderColor": "#FFE66D",
			"selectedIconColor": "#96E072",
			"unselectedIconColor": "#f92672",
			"keyColor": "#ee5d43",
			"keySelectedColor": "#FFE66D",
			"toastify-info": "#00e8c6",
			"toastify-success": "#96E072",
			"toastify-warning": "#f92672",
			"toastify-error": "#f92672",
			"toastify-background": "#23262E",
			"toastify-text-color-info": "#23262E",
			"toastify-text-color-success": "#23262E",
			"toastify-text-color-warning": "#23262E",
			"toastify-text-color-error": "#23262E",
			"toastify-text-color-light": "#FFE66D",
			"toastify-color-light": "#363c49"
		}
	},
];

/**
 * Get CSS property variables for the corresponding theme.
 * @param {AVAILABLE_THEMES} name Name of the theme.
 * @returns {Object} Object containing CSS variables for the theme.
 */
export function getThemeStyles(name: AVAILABLE_THEMES) {
    if (!name) {
        return;
    }

	const theme = themeOptions.find((opt) => opt.name === name);
    
	return {
		'--backgroundColor': theme!.colors.backgroundColor,
		'--textColor': theme!.colors.textColor,
		'--specialTextColor': theme!.colors.specialTextColor,
		'--buttonColor': theme!.colors.buttonColor,
		'--buttonHoverColor': theme!.colors.buttonHoverColor,
		'--borderColor': theme!.colors.borderColor,
		'--selectedIconColor': theme!.colors.selectedIconColor,
		'--unselectedIconColor': theme!.colors.unselectedIconColor,
		'--keyColor': theme!.colors.keyColor,
		'--keySelectedColor': theme!.colors.keySelectedColor,
		'--toastify-color-info': theme!.colors['toastify-info'],
		'--toastify-color-success': theme!.colors['toastify-success'],
		'--toastify-color-warning': theme!.colors['toastify-warning'],
		'--toastify-color-error': theme!.colors['toastify-error'],
		'--toastify-toast-background': theme!.colors['toastify-background'],
		'--toastify-text-color-info': theme!.colors['toastify-text-color-info'],
		'--toastify-text-color-success':
			theme!.colors['toastify-text-color-success'],
		'--toastify-text-color-warning':
			theme!.colors['toastify-text-color-warning'],
		'--toastify-text-color-error':
			theme!.colors['toastify-text-color-error'],
		'--toastify-text-color-light':
			theme!.colors['toastify-text-color-light'],
		'--toastify-color-light': theme!.colors['toastify-color-light'],
	} as const;
}

/**
 * Get the codemirror theme extension.
 * @param {AVAILABLE_THEMES} name Name of the theme.
 * @returns {Extension} Corresponding Codemirror theme Extension.
 */
export function getEditorTheme(name: AVAILABLE_THEMES) {
	switch (name) {
		case 'light': return githubLight;
		case 'dark': return githubDark;
		case 'tokyo-night': return tokyoNightStorm;
		case 'noctis-light': return noctisLilac;
		case 'bespin': return bespin;
		case 'andromeda': return andromeda;
		default: 
            console.debug('Could not find editor theme', name);
            return githubLight;
	}
}