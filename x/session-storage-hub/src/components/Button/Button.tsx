import './Button.css';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	version?: 'default' | 'link';
	onClickCallback: () => void;
}

const Button = ({
	version = 'default',
	className,
	onClickCallback,
	...props
}: IButtonProps) => {
	return (
		<button
			className={`Button__${version} ${className ?? ''} border-none bg-transparent text-[var(--buttonColor)] cursor-pointer hover:no-underline hover:text-[var(--buttonHoverColor)] hover:border-[var(--buttonHoverColor)]`}
			{...props}
			onClick={onClickCallback}
		>
			{props.children}
		</button>
	);
};

export default Button;
