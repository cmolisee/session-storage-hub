import './Header.scss';

interface IHeaderProps {
	title: string;
	// generally the link to the options view
	link: JSX.Element;
	versionNumber?: string;
}

const Header = ({ title, link, versionNumber }: IHeaderProps) => {
	return (
		<div className={'Header'}>
			<div>
				<h1>{title}</h1>
				{link}
			</div>
			<div>
				<p>version {versionNumber ?? 'UNKNOWN'}</p>
			</div>
		</div>
	);
};

export default Header;
