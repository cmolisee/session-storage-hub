import { HTMLProps, forwardRef } from "react";

interface ICheckboxProps extends HTMLProps<HTMLInputElement> {
    className?: string;
    label?: string;
}

const Checkbox = forwardRef(function checkbox(props: ICheckboxProps, ref: any) {
    return (
        <label className={`flex items-center justify-around ${props.className}`} htmlFor={props.label}>
            {props.label ?? 'checkbox'}
            <input ref={ref} id={props.label} type={'checkbox'} />
        </label>
    );
});

export default Checkbox;