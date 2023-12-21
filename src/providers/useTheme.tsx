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
import { requestData } from '../utils/ChromeUtils';
import { Themes, IThemeStyles, ITheme } from '../types/types';

interface IThemeContextProps {
	theme: Themes;
	styles: IThemeStyles;
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
			}}>
			{children}
		</ThemeContext.Provider>
	);
};
