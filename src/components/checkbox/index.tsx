export default function Checkbox(props: any) {
    const labelStyles = `flex items-center justify-around ${props.class}`;

    return (
        <label class={labelStyles} for={props.label}>
            {props.label}
            <input ref={props.ref} id={props.label} type="checkbox" />
        </label>
    )
}