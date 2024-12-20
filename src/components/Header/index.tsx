import "~/assets/tailwind.css";
import { A } from "@solidjs/router";

export default function Header(props: any) {
	const containerStyles = 'flex items-center text-[var(--specialTextColor)] mb-4 px-1';

    return (
        <div class={containerStyles}>
            <div class={'grow-[1] cursor-default text-lg'}>
                Session Storage Hub
            </div>
            <A class={'grow-[1] text-right'} href={props.link}>{props.text}</A>
        </div>
    )
}
