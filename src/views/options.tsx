import Header from '../components/Header/Header';
import { Link } from 'react-router-dom';
import { Themes, useTheme } from '../providers/useTheme';
import { useEffect } from 'react';
import { saveOptions } from '../utils/ChromeUtils';
import SelectDropdown from '../components/SelectDropdown';
import '../options.scss';

const Options = () => {
	const { styles, setTheme } = useTheme();
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
				versionNumber={process.env.VERSION as string}
			/>
			<div className={'optionFields'}>
				<SelectDropdown
					label={'Select a Theme'}
					initialValue={Themes.a11yLight}
					options={Object.keys(Themes)}
					changeCallback={(option: string) => handleUpdateTheme(option as Themes)} />
			</div>
		</div>
	);
};

export default Options;
