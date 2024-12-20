import Header from "@/components/Header";
import SelectDropdown from "@/components/SelectDropdown";
import { useExtensionOptions } from "@/hooks/useExtensionOptions";
import { AVAILABLE_THEMES } from "@/utils/constants";

function Options() {
    const { extensionOptions, setExtensionOptions } = useExtensionOptions();
    const themeOptions = Object.values(AVAILABLE_THEMES)
        .filter((theme) => theme !== extensionOptions.theme)
        .map((theme) => {
            return { value: theme, label: theme };
        });

    return (
		<div>
			<Header link={'/'} text={'Close'} />
			<div class={'flex flex-wrap justify-center content-center m-8'}>
				<SelectDropdown
					label={'Select a Theme'}
					initial={{
						value: extensionOptions.theme,
						label: extensionOptions.theme,
					}}
					options={themeOptions}
					changeCallback={(theme: AVAILABLE_THEMES) => {
						setExtensionOptions({ theme: theme });
					}}
				/>
			</div>
		</div>
	);
}

export default Options;