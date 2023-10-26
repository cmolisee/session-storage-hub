import { useEffect, useState } from 'react';
import './SelectDropdown.scss';

export interface ISelectDropdownProps {
    label: string;
    initialValue?: string;
    options: string[];
    changeCallback?: (option: string) => void;
}

const SelectDropdown = ({
    label,
    initialValue,
    options,
    changeCallback,
}: ISelectDropdownProps) => {
    const [selected, setSelected] = useState<string>(initialValue as string);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleOptionSelect = (e: React.MouseEvent<HTMLLIElement>) => {
        setSelected(e.currentTarget.innerText);
        setShowDropdown(false);
    }

    // useEffect(() => {
    //     function handleClickOutside (e: any) {
    //         if (
    //             !e?.target?.classList?.contains('selectDropdown-options') && 
    //             !e?.target?.classList?.contains('selectDropdown-option')
    //         ) {
    //             setShowDropdown(false);
    //         }
    //     }
    
    //     if (showDropdown) {
    //         document.addEventListener('click', handleClickOutside);
    //     }

    //     return () => {
    //       document.removeEventListener('click', handleClickOutside);
    //     };
    //   }, [showDropdown]);

    useEffect(() => {
        if (typeof changeCallback === 'function') {
            changeCallback(selected);
        }
    }, [selected]);

    return (
        <div className={'selectDropdown'}>
            <div className={'selectDropdown-label'}>{label}</div>
            <div className={`selectDropdown-text ${showDropdown ? 'active' : ''}`}
                onClick={() => setShowDropdown(true)}
            >
                {selected}
            </div>
            {showDropdown && (
                <ul className={'selectDropdown-options'}>
                    {options.map((opt, i) => (
                        <li className={'selectDropdown-option'}
                        key={i}
                        onClick={handleOptionSelect}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SelectDropdown