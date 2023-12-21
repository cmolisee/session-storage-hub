import { Link } from 'react-router-dom';
import Control from '../Control/Control';

interface IHeaderProps {
	versionNumber?: string;
	viewLink: 'home' | 'options';
}

const Header = ({ versionNumber, viewLink }: IHeaderProps) => {
	const containerStyles =
		'flex items-center text-[var(--specialTextColor)] mb-4 px-1';

	return (
		<div className={containerStyles}>
			<div className={'grow-[1] cursor-default text-lg'}>
				Session Storage Hub
			</div>
			<div className={'grow-[1] cursor-default'}>
				version {versionNumber ?? 'UNKNOWN'}
			</div>
			<Control className={'grow-[3] text-right'}>
				{viewLink === 'home' ? (
					<Link to={'/'}>Close</Link>
				) : (
					<Link to={'/options'}>Options</Link>
				)}
			</Control>
		</div>
	);
};

export default Header;
