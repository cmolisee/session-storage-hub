import {
	createContext,
	useContext,
	PropsWithChildren,
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
	useMemo,
} from 'react';
import jsonThemes from '../assets/themes.json';
import { requestOptionData } from '../utils/ChromeUtils';
import {
	Themes,
	IThemeStyles,
	ITheme,
	IReactToastifyStyles,
} from '../types/types';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import { Extension } from '@uiw/react-codemirror';
import { noctisLilac } from '@uiw/codemirror-theme-noctis-lilac';
import { bespin } from '@uiw/codemirror-theme-bespin';
import { andromeda } from '@uiw/codemirror-theme-andromeda';

interface IThemeContextProps {
	theme: Themes;
	editorTheme: Extension;
	styles: IThemeStyles & IReactToastifyStyles;
	setTheme: Dispatch<SetStateAction<Themes>> | null;
}

const DefaultTheme = {
	theme: Themes.light,
	editorTheme: githubLight,
	styles: getStylesFromTheme(Themes.light),
	setTheme: null,
};

const ThemeContext = createContext<IThemeContextProps>(DefaultTheme);
export const useTheme = () => {
	return useContext(ThemeContext);
};

function getStylesFromTheme(name: Themes) {
	const theme =
		jsonThemes.filter((t: ITheme) => {
			return t.name.valueOf() === name.valueOf();
		})[0] ?? jsonThemes[0];
	return {
		'--backgroundColor': theme.colors.backgroundColor,
		'--textColor': theme.colors.textColor,
		'--specialTextColor': theme.colors.specialTextColor,
		'--buttonColor': theme.colors.buttonColor,
		'--buttonHoverColor': theme.colors.buttonHoverColor,
		'--borderColor': theme.colors.borderColor,
		'--selectedIconColor': theme.colors.selectedIconColor,
		'--unselectedIconColor': theme.colors.unselectedIconColor,
		'--keyColor': theme.colors.keyColor,
		'--keySelectedColor': theme.colors.keySelectedColor,
		'--toastify-color-info': theme.colors['toastify-info'],
		'--toastify-color-success': theme.colors['toastify-success'],
		'--toastify-color-warning': theme.colors['toastify-warning'],
		'--toastify-color-error': theme.colors['toastify-error'],
		'--toastify-toast-background': theme.colors['toastify-background'],
		'--toastify-text-color-info': theme.colors['toastify-text-color-info'],
		'--toastify-text-color-success':
			theme.colors['toastify-text-color-success'],
		'--toastify-text-color-warning':
			theme.colors['toastify-text-color-warning'],
		'--toastify-text-color-error':
			theme.colors['toastify-text-color-error'],
		'--toastify-text-color-light':
			theme.colors['toastify-text-color-light'],
		'--toastify-color-light': theme.colors['toastify-color-light'],
	} as IThemeStyles & IReactToastifyStyles;
}

function getEditorTheme(name: Themes) {
	switch (name) {
		case 'light': return githubLight;
		case 'dark': return githubDark;
		case 'tokyo-night': return tokyoNightStorm;
		case 'noctis-light': return noctisLilac;
		case 'bespin': return bespin;
		case 'andromeda': return andromeda;
		default: return githubLight;
	}
}

export const ThemeProvider = ({
	defaultThemeName,
	children,
}: PropsWithChildren<{ defaultThemeName: Themes }>) => {
	const [theme, setTheme] = useState<Themes>(defaultThemeName);

	useEffect(() => {
		requestOptionData('options', (items: any) => {
			if (Object.values(Themes).includes(items.options?.name)) {
				setTheme(items.options?.name);
			}
		});
	}, []);

	return (
		<ThemeContext.Provider
			value={useMemo(() => {
				return {
					theme: theme,
					editorTheme: getEditorTheme(theme),
					styles: getStylesFromTheme(theme),
					setTheme: setTheme,
				};
			}, [theme])}>
			{children}
		</ThemeContext.Provider>
	);
};
