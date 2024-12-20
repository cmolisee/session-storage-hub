import ViewGridKey from "../ViewGridKey";
import ViewGridValue from "../ViewGridValue";
import './styles.css';

export default function ViewGrid(props: any) {
    const { storage } = useStorage();
    const keys = () => storage.keys;

    return (
        <div class={tailwindMerge('ViewGrid grid grid-cols-12', props.class)}>
            <div class={'ViewGrid__30 col-span-3'}>
                <For each={keys()}>
                    {(k) => ((
                        <ViewGridKey key={k} keyName={k} />
                    ))}
                </For>
            </div>
            <div class={'ViewGrid__70 col-span-9'}>
                <ViewGridValue />
            </div>
        </div>
    )
}

