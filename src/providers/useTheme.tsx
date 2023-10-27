import {
	createContext,
	useContext,
	PropsWithChildren,
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
} from 'react';
import jsonThemes from '../themes.json';
import { requestData } from '../utils/ChromeUtils';

export enum Themes {
	a11yLight = 'a11y-light',
	darkOrange = 'dark-orange',
	retroSunset = 'retro-sunset',
	mfDracula = 'mf-dracula',
}

export interface ITheme {
	name: string;
	colors: IColors;
}

export interface IColors {
	backgroundColor: string;
	textColor: string;
	specialTextColor: string;
	buttonColor: string;
	buttonHoverColor: string;
	borderColor: string;
	selectedIconColor: string;
	unselectedIconColor: string;
	keyColor: string;
	keySelectedColor: string;
	objectColor: string;
	arrayColor: string;
	stringColor: string;
	numberColor: string;
	booleanColor: string;
	nullColor: string;
	undefinedColor: string;
	emptyColor: string;
}

export interface IThemeStyles {
	'--backgroundColor': string;
	'--textColor': string;
	'--specialTextColor': string;
	'--buttonColor': string;
	'--buttonHoverColor': string;
	'--borderColor': string;
	'--selectedIconColor': string;
	'--unselectedIconColor': string;
	'--keyColor': string;
	'--keySelectedColor': string;
	'--objectColor': string;
	'--arrayColor': string;
	'--stringColor': string;
	'--numberColor': string;
	'--booleanColor': string;
	'--nullColor': string;
	'--undefinedColor': string;
	'--emptyColor': string;
}

interface IThemeContextProps {
	theme: Themes;
	styles: IThemeStyles;
	setTheme: Dispatch<SetStateAction<Themes>> | null;
}

export const DefaultTheme = {
	theme: Themes.a11yLight,
	styles: getStylesFromTheme(Themes.a11yLight),
	setTheme: null,
};

export const ThemeContext = createContext<IThemeContextProps>(DefaultTheme);
export const useTheme = () => useContext(ThemeContext);

function getStylesFromTheme(name: Themes) {
	const theme =
		jsonThemes.filter(
			(t: ITheme) => t.name.valueOf() === name.valueOf()
		)[0] ?? jsonThemes[0];
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
	} as IThemeStyles;
}

export const ThemeProvider = ({
	defaultThemeName,
	children,
}: PropsWithChildren<{ defaultThemeName: Themes }>) => {
	const [theme, setTheme] = useState<Themes>(defaultThemeName);

	useEffect(() => {
		requestData('options', (items) => {
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
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};
