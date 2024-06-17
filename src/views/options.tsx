import Header from '../components/Header/Header';
import { useEffect } from 'react';
import { saveOptionData } from '../utils/ChromeUtils';
import SelectDropdown from '../components/SelectDropdown/SelectDropdown';
import { useTheme } from '../providers/useTheme';
import { Themes } from '../types/types';

const Options = () => {
	const { theme, styles, setTheme } = useTheme();

	const handleUpdateTheme = (theme: Themes) => {
		setTheme!(theme);
		saveOptionData({ name: theme }, () => {
			return console.debug('[Theme saved]');
		});
	};

	function getKeyByValue(value: string, e: object) {
		for (const key in e) {
			if (e[key as keyof typeof e] === value) {
				return key;
			}
		}
	}

	useEffect(() => {
		const html = document.documentElement;
		Object.entries(styles).forEach((s) => {
			return html.style.setProperty(s[0], s[1]);
		});
	}, [styles]);

	return (
		<div>
			<Header viewLink={'home'} />
			<div className={'flex flex-wrap justify-center content-center m-8'}>
				<SelectDropdown
					label={'Select a Theme'}
					initial={{
						value: theme,
						label: getKeyByValue(theme, Themes) ?? 'undefined',
					}}
					options={Object.entries(Themes).map((e) => {
						return {
							value: e[0],
							label: e[1],
						};
					})}
					changeCallback={(option: string) => {
						return handleUpdateTheme(option as Themes);
					}}
				/>
			</div>
		</div>
	);
};

export default Options;
