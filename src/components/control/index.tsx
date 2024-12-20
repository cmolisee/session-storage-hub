import { tailwindMerge } from "@/utils/utils";

export default function Control(props: any) {
    const styles = `border-none bg-transparent cursor-pointer`;
    const spaceStyles = `py-1 my-0.5 mx-2`;
    const hoverStyles = `hover:no-underline hover:text-[var(--buttonHoverColor)] hover:border-[var(--buttonHoverColor)]`;

    return (
        <button class={tailwindMerge(styles, spaceStyles, hoverStyles, props.class)} onClick={props.onClickCallback}>
            {props.children}
        </button>
    )
}