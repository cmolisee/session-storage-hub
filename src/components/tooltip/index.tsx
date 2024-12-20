export default function Tooltip(props: any) {
    const [isVisible, setIsVisible] = createSignal(false);
    const position = props.position || 'top';

    const positionStyles = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div class='relative inline-block group'>
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                class='inline-block'>
                {props.children}
            </div>

            <Show when={isVisible()}>
                <div class={tailwindMerge('absolute w-fit bg-gray-800  text-white text-sm px-2 py-1 rounded z-50 max-w-xs max-h-40 overflow-hidden break-words line-clamp-5', positionStyles[position as keyof typeof positionStyles])}
                    style={{ 'width': 'max-content', 'max-width': '16rem', 'white-space': 'normal', 'word-wrap': 'break-word' }}>
                    {props.text}
                </div>
            </Show>
        </div>
    );
};
