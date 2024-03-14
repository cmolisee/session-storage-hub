interface IControlProps {
	className?: string;
	children?: React.ReactNode;
	link?: string;
	onClickCallback?: () => void;
}

const Control = ({ className, children, onClickCallback }: IControlProps) => {
	const styleClassNames = 'border-none bg-transparent cursor-pointer';
	const spacingClassNames = 'py-1 px-4 my-0.5 mx-2';
	const hoverClassNames =
		'hover:no-underline hover:text-[var(--buttonHoverColor)] hover:border-[var(--buttonHoverColor)]';

	return (
		<button
			className={[
				styleClassNames,
				spacingClassNames,
				hoverClassNames,
				className,
			].join(' ')}
			onClick={onClickCallback}>
			{children}
		</button>
	);
};

export default Control;
