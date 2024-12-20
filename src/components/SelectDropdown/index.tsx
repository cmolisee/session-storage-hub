import { IOption } from '@/types/global';
import './styles.css';

export default function Select(props: any) {
    const [selected, setSelected] = createSignal(props.initial);
    const [isOpen, setIsOpen] = createSignal(false);

    const mainStyles = 'flex flex-col items-center text-center w-40';
    const labelStyles = 'cursor-pointer text-base text-[var(--buttonColor)] mb-2';
    const textStyles = 'cursor-pointer text-sm p-2 w-32 text-[var(--buttonColor)] border-2 border-solid border-[var(--buttonColor)] rounded-md';
    const optionStyles = 'list-none cursor-pointer w-28 py-2 px-0 text-[var(--buttonHoverColor)] border-t border-solid border-[var(--buttonColor)] hover:text-[var(--backgroundColor)] hover:bg-[var(--buttonHoverColor)]';

    const handleSelect = (option: IOption) => {

        setIsOpen(false);
        setSelected(option);
    };

    const handleClickOutside = (e: any) => {
        if (
            isOpen() &&
            !/(selectDropdown-option|selectDropdown-options|selectDropdown)/g.test(
                e.target?.classList
            )
        ) {
            setIsOpen(false);
        }
    };

    onMount(() => {
        document.body.addEventListener('mousedown', handleClickOutside);

        onCleanup(() => {
            document.body.removeEventListener('mousedown', handleClickOutside);
        })
    });

    createEffect(() => {
        props.changeCallback(selected().value);
    });

    return (
        <div class={tailwindMerge('selectDropdown', mainStyles, textStyles)}
            onclick={() => setIsOpen(true)}>
                <div class={tailwindMerge('selectDropdown-label', labelStyles)}>{props.label}</div>
                <div class={tailwindMerge('selectDropdown-label', labelStyles)}>
                    {selected().label}
                </div>
                {isOpen() && (
                    <ul class={'p-0 m-0 z-[1000] w-28'}>
                    <For each={props.options}>
                        {(opt, i) => ((
                            <li class={tailwindMerge('selectDropdown-option', optionStyles, i() === 0 ? 'mt-2' : '')}
                                value={opt.value}
                                onClick={() => handleSelect(opt)}>
                                {opt.label}
                            </li>
                        ))}
                    </For>
                    </ul>
                )}
        </div>
    );
}