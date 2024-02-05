import {
	createContext,
	useContext,
	PropsWithChildren,
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
} from 'react';
import jsonThemes from '../assets/themes.json';
import { requestOptionData } from '../utils/ChromeUtils';
import {
	Themes,
	IThemeStyles,
	ITheme,
	IReactToastifyStyles,
} from '../types/types';

interface IThemeContextProps {
	theme: Themes;
	styles: IThemeStyles & IReactToastifyStyles;
	setTheme: Dispatch<SetStateAction<Themes>> | null;
}

const DefaultTheme = {
	theme: Themes.a11yLight,
	styles: getStylesFromTheme(Themes.a11yLight),
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
		'--objectColor': theme.colors.objectColor,
		'--arrayColor': theme.colors.arrayColor,
		'--stringColor': theme.colors.stringColor,
		'--numberColor': theme.colors.numberColor,
		'--booleanColor': theme.colors.booleanColor,
		'--nullColor': theme.colors.nullColor,
		'--undefinedColor': theme.colors.undefinedColor,
		'--emptyColor': theme.colors.emptyColor,
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
			value={{
				theme: theme,
				styles: getStylesFromTheme(theme),
				setTheme: setTheme,
			}}>
			{children}
		</ThemeContext.Provider>
	);
};
