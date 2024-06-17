import { useEffect, useRef, useState } from 'react';
import './SelectDropdown.css';

type TOptionType = { value: string; label: string };

interface ISelectDropdownProps {
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
    const mainStyles = 'flex flex-col items-center text-center w-40';
    const labelStyles =
        'cursor-pointer text-base text-[var(--buttonColor)] mb-2';
    const textStyles =
        'cursor-pointer text-sm p-2 w-32 text-[var(--buttonColor)] border-2 border-solid border-[var(--buttonColor)] rounded-md';
    const optionStyles =
        'list-none cursor-pointer w-28 py-4 px-0 text-[var(--buttonHoverColor)] border-b border-solid border-[var(--buttonColor)] hover:text-[var(--backgroundColor)] hover:bg-[var(--buttonHoverColor)]';

    const handleOptionSelect = (e: React.MouseEvent<HTMLLIElement>) => {
        setSelected(e.currentTarget.innerText);
        setShowDropdown(false);
    };

    const handleClickOutside = (e: any) => {
        if (
            showDropdown &&
            !/(selectDropdown-option|selectDropdown-options|selectDropdown)/g.test(
                e.target?.classList
            )
        ) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.body.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.body.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (typeof changeCallback === 'function') {
            changeCallback(selected);
        }
    }, [selected]);

    return (
        <div
            className={`selectDropdown ${mainStyles}`}
            ref={dropdownRef}>
            <div className={`selectDropdown-label ${labelStyles}`}>{label}</div>
            <div
                className={`selectDropdown-text ${textStyles} ${showDropdown ? 'active' : ''
                    }`}
                onClick={() => {
                    return setShowDropdown(true);
                }}>
                {selected}
            </div>
            {showDropdown && (
                <ul className={'p-0 m-0 z-[1000] w-28'}>
                    {options.map((opt, i) => {
                        return (
                            <li
                                className={optionStyles}
                                key={i}
                                value={opt.value}
                                onClick={handleOptionSelect}>
                                {opt.label}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default SelectDropdown;