import { useEffect, useRef, useState } from 'react';
import './SelectDropdown.css';

export type TOptionType = { value: string; label: string };
export interface ISelectDropdownProps {
	label: string;
	initial?: TOptionType;
	options: TOptionType[];
	changeCallback?: (option: any) => void;
}

const SelectDropdown = ({
	label,
	initial,
	options,
	changeCallback,
}: ISelectDropdownProps) => {
	const [selected, setSelected] = useState<string>(initial?.value as string);
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleOptionSelect = (e: React.MouseEvent<HTMLLIElement>) => {
		setSelected(e.currentTarget.innerText);
		setShowDropdown(false);
	};

	const handleClickOutside = (e: any) => {
		if (
			showDropdown &&
			!/(selectDropdown-option|selectDropdown-options)/g.test(
				e.target?.classList
			)
		) {
			setShowDropdown(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log(typeof changeCallback);
		console.log(selected);
		if (typeof changeCallback === 'function') {
			changeCallback(selected);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected]);

	return (
		<div
			className={'selectDropdown'}
			ref={dropdownRef}
		>
			<div className={'selectDropdown-label'}>{label}</div>
			<div
				className={`selectDropdown-text ${
					showDropdown ? 'active' : ''
				}`}
				onClick={() => setShowDropdown(true)}
			>
				{selected}
			</div>
			{showDropdown && (
				<ul className={'selectDropdown-options'}>
					{options.map((opt, i) => (
						<li
							className={'selectDropdown-option'}
							key={i}
							value={opt.value}
							onClick={handleOptionSelect}
						>
							{opt.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SelectDropdown;
