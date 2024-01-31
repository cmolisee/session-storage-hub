import { useEffect, useState } from 'react';

type TDropdownOptions = { label: string; onClickCallback: () => void };

interface IControlProps {
	className?: string;
	label: string;
	options: TDropdownOptions[];
}

const DropdownMenu = ({ className, label, options }: IControlProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const containerClassNames =
		'relative inline-block text-left cursor-pointer';
	const menuClassNames =
		'dropdownMenuButton inline-flex w-full items-center bg-transparent py-1 px-4 my-0.5 mx-2 font-bold hover:text-[var(--buttonHoverColor)]';
	const svgClassNames = 'mt-0.5 h-5 w-5';
	const menuListClassNames =
		'dropdownMenuList absolute right-1 z-10  w-fit origin-top-right bg-[var(--backgroundColor)] focus:outline-none';
	const optionClassnames =
		'dropdownMenuItem block text-nowrap px-2 py-2 text-sm hover:no-underline hover:text-[var(--buttonHoverColor)] hover:border-[var(--buttonHoverColor)]';

	const handleClickOutside = (e: any) => {
		if (
			isOpen &&
			!/(dropdownMenuButton|dropdownMenuList|dropdownMenuItem)/g.test(
				e.target?.classList
			)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.body.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.body.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className={`${containerClassNames} ${className}`}>
			<div>
				<button
					type={'button'}
					className={menuClassNames}
					id={'menu-button'}
					aria-expanded={isOpen}
					aria-haspopup={'true'}
					onClick={() => {
						setIsOpen((prev) => {
							return !prev;
						});
					}}>
					{label}
					{/* TODO: animate on open */}
					<svg
						className={svgClassNames}
						viewBox={'0 0 20 20'}
						fill={'currentColor'}
						aria-hidden={'true'}>
						<path
							fillRule={'evenodd'}
							d={
								'M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
							}
							clipRule={'evenodd'}
						/>
					</svg>
				</button>
			</div>

			{/* 
				Dropdown menu, show/hide based on menu state.
				import { Menu, Transition } from '@headlessui/react'

				<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95">
			*/}
			{isOpen && (
				<div
					className={menuListClassNames}
					role={'menu'}
					aria-orientation={'vertical'}
					aria-labelledby={'menu-button'}
					tabIndex={-1}>
					<div
						className={'py-1'}
						role={'none'}>
						{options.map((opt, i) => {
							return (
								<div
									key={i}
									id={`menu-item-${i}`}
									className={optionClassnames}
									role={'menuitem'}
									tabIndex={-1}
									onClick={opt.onClickCallback}>
									{opt.label}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default DropdownMenu;
