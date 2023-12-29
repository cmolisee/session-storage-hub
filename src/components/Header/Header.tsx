import { Link } from 'react-router-dom';
import Control from '../Control/Control';

interface IHeaderProps {
	viewLink: 'home' | 'options';
}

const Header = ({ viewLink }: IHeaderProps) => {
	const containerStyles =
		'flex items-center text-[var(--specialTextColor)] mb-4 px-1';

	return (
		<div className={containerStyles}>
			<div className={'grow-[1] cursor-default text-lg'}>
				Session Storage Hub
			</div>
			<Control className={'grow-[1] text-right'}>
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
