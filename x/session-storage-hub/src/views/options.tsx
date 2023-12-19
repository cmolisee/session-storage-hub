import Header from '../components/Header/Header';
import { Link } from 'react-router-dom';
import { Themes, useTheme } from '../providers/useTheme';
import { useEffect } from 'react';
import { saveOptions } from '../utils/ChromeUtils';
import SelectDropdown from '../components/SelectDropdown';
import { getKeyByValue } from '../utils/helperUtils';

const Options = () => {
	const { theme, styles, setTheme } = useTheme();
	const popupLink = (
		<Link
			style={{ textDecoration: 'none' }}
			className={'Button Button__link'}
			to={'/'}
		>
			Close
		</Link>
	);

	const handleUpdateTheme = (theme: Themes) => {
		setTheme!(theme);
		saveOptions({ name: theme }, () => console.log('[Theme saved]'));
	};

	useEffect(() => {
		const html = document.documentElement;
		Object.entries(styles).forEach((s) =>
			html.style.setProperty(s[0], s[1])
		);
	}, [styles]);

	return (
		<div>
			<Header
				title={'Options'}
				link={popupLink}
				versionNumber={VERSION as string}
			/>
			<div className={'optionsGrid'}>
				<div className={'optionsGrid-colOne'}>
					<SelectDropdown
						label={'Select a Theme'}
						initial={{
							value: theme,
							label: getKeyByValue(theme, Themes) ?? 'undefined',
						}}
						options={Object.entries(Themes).map((e) => ({
							value: e[0],
							label: e[1],
						}))}
						changeCallback={(option: string) =>
							handleUpdateTheme(option as Themes)
						}
					/>
				</div>
				<div className={'optionsGrid-colTwo'}></div>
			</div>
		</div>
	);
};

export default Options;

// TODO:
// consider configuring tailwind/vite nested styles
// consider altering the chrome api calls so that if they "DNE" they don't totally kill anything.
// take a look at updating the theme file and theming implmenetation to better work with tailwind and vite
// once dev server is displaying things as expected move onto the build configs
	// build the appropriate files and sources to the correct directory
	// adjust manifest to point to the right files
	// translate and modify the workflow files, pipelines, scripts, and other path dependent devops stuff
	// now modify to use with docker
	// 
