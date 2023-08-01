import Header from '../components/Header/Header';
import { Link } from 'react-router-dom';
import List from '../components/List/List';
import Button from '../components/Button/Button';
import { Themes, useTheme } from '../providers/useTheme';
import { useEffect } from 'react';
import { saveOptions } from '../utils/Chrome-Utils';

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
		saveOptions({ name: theme }, () =>
			console.log('[Theme saved]')
		);
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
			/>
			<List bullet={'none'}>
				<li>
					<Button
						onClickCallback={() =>
							handleUpdateTheme(Themes.a11yLight)
						}
					>
						a11y-light Theme
					</Button>
				</li>
				<li>
					<Button
						onClickCallback={() =>
							handleUpdateTheme(Themes.darkOrange)
						}
					>
						dark-orange Theme
					</Button>
				</li>
			</List>
		</div>
	);
};

export default Options;
