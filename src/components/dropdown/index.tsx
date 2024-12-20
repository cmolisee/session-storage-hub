import { tailwindMerge } from "@/utils/utils";
import { JSX } from "solid-js/jsx-runtime";

export default function Dropdown(props: any) {
    const [selected, setSelected] = createSignal<string>(props.initial?.value);
    const [showDropdown, setShowDropdown] = createSignal(false);
    const mainStyles = 'flex flex-col items-center text-center w-40';
	const labelStyles = 'cursor-pointer text-base text-[var(--buttonColor)] mb-2';
	const textStyles = 'cursor-pointer text-sm p-2 w-32 text-[var(--buttonColor)] border-2 border-solid border-[var(--buttonColor)] rounded-md';
	const optionStyles = 'list-none cursor-pointer w-28 py-4 px-0 text-[var(--buttonHoverColor)] border-b border-solid border-[var(--buttonColor)] hover:text-[var(--backgroundColor)] hover:bg-[var(--buttonHoverColor)]';
    const hoverStyles = 'hover:border-[var(--buttonHoverColor)] hover:text-[var(--buttonHoverColor)]';

    const handleSelect: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
        setSelected(e.currentTarget.innerText);
        setShowDropdown(false);
    }

    const handleClickOutside = (e: MouseEvent) => {
        const isInside = new RegExp('(selectDropdown-option|selectDropdown-options)', 'g');
        if (showDropdown() && !isInside.test((e.target as HTMLElement).classList.toString())) {
            setShowDropdown(false);
        }
    }

    onMount(() => {
        document.addEventListener('mousedown', handleClickOutside);
    });

    onCleanup(() => {
        document.removeEventListener('mousedown', handleClickOutside);
    });

    createEffect(() => {
        if (typeof props.changeCallback === 'function') {
            props.changeCallback(selected())
        }
    });

	return (
		<div class={tailwindMerge(mainStyles, hoverStyles)}>
			<div class={tailwindMerge(labelStyles, hoverStyles)}>{props.label}</div>
			<div class={tailwindMerge(textStyles, hoverStyles, showDropdown() ? 'active' : '')}
				onClick={() => setShowDropdown(true)}>
				{selected()}
			</div>
			{showDropdown() && (
				<ul class='p-0 m-0 z-[1000] w-28'>
                    <For each={props.options}>
                        {(item, i) => {
                            return (
                                <li class={optionStyles}
                                    value={item.value}
                                    onClick={handleSelect}>
                                    {item.label}
                                </li>
                            )
                        }}
                    </For>
				</ul>
			)}
		</div>
	);
};
