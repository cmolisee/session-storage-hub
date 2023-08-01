import './Header.scss';

interface IHeaderProps {
	title: string;
	versionNumber?: string;
	link: JSX.Element;
}

const Header = ({ title, versionNumber, link }: IHeaderProps) => {
	return (
		<div className={'Header'}>
			<div>
				<h1>{title}</h1>
				{link}
			</div>
			{versionNumber && (
				<div>
					<p>version {versionNumber}</p>
				</div>
			)}
		</div>
	);
};

export default Header;
