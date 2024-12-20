import './styles.css';

export default function ViewGridKey(props: any) {
    const { storage, setActiveKey, setSelectedKeys } = useStorage();
    const [isEditing, setIsEditing] = createSignal(false);
    const [value, setValue] = createSignal<string>();

    const selectedKeys = () => storage.selectedKeys;
    const activeKey = () => storage.activeKey;

    const handleSelectedChange = () => {
		if (!selectedKeys()?.includes(props.keyName)) {
			setSelectedKeys([...selectedKeys(), props.keyName]);
		} else {
			setSelectedKeys(selectedKeys()?.filter((k) => { return k !== props.keyName }));
		}
	};

	const handleSetActiveKey = () => {
		setActiveKey(props.keyName);
	};

	const onDoubleClickHandler = () => {
		setIsEditing(true);
	};

	const handleUpdateKey = async (newKey: string) => {
		// if empty, null, or no change
		if (!newKey || newKey === props.keyName) {
			setIsEditing(false);
			return;
		}

        const dataUpdate = deepCopy(storage.sessionStorageData);
        const entryValue = dataUpdate[activeKey()];
        delete dataUpdate[activeKey()];
        dataUpdate[newKey] = entryValue;
        await extensionMessenger.sendMessage('sendToBackground', dataUpdate)
            .catch((error) => console.debug(error));
        
		setIsEditing(false);
	};

    const handleChange = (e: any) => {
		setValue(e.target.value);
	};

	const handleOnblur = (e: any) => {
		if (e.target.value) {
			setValue(e.target.value);
			handleUpdateKey(e.target.value);
		} else {
			setValue(e.target.value);
		}
	};

	const handleEnterKey = (e: any) => {
		if (e.key === 'Enter') {
			if (e.currentTarget.value) {
				setIsEditing(false);
				handleUpdateKey(e.currentTarget.value);
			} else {
				setValue(props.keyName);
			}
		}
	};

    onMount(() => {
        if (!value()) {
            setValue(props.keyName);
        }
    });

    return (
		<div class={'ViewGridKey'}
			aria-selected={activeKey() === props.keyName}>
			<input type={'checkbox'}
				checked={selectedKeys()?.includes(props.keyName)}
				onChange={handleSelectedChange}
			/>
			<div class={'mx-[0.25rem]'} onDblClick={onDoubleClickHandler}>
				{!isEditing() ? (
					<p onClick={handleSetActiveKey}>{value()}</p>
				) : (
					<input type={'text'}
						autofocus
						class={'focus-visible:outline-none bg-transparent'}
						value={value()}
						onChange={handleChange}
						onBlur={handleOnblur}
						onKeyUp={handleEnterKey} />
				)}
			</div>
		</div>
	);
}

