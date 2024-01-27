import { useEffect, useState } from "react";
import "./styles.css";
import Line from "./Line";
import ToggleIcon from "./ToggleIcon";
import { getDataAsFormattedJson, getDataType } from "../../utils/Utils";
import { TDataTypes } from "../../types/types";
import { useStorageData } from "../../providers/StorageDataProvider";

type TLineProps = { content: string, isCollapsed: boolean };

const Editor = () => {
	const [lines, setLines] = useState<TLineProps[]>([]);
	const { dataValue, isEditing } = useStorageData();

	const linesToData = (lines: TLineProps[]) => {
		console.log(lines.map((l) => l.content).join(''));
	};

	useEffect(() => {
		const formattedData = getDataAsFormattedJson(dataValue);

		if (typeof formattedData === 'object') {
			const parsedData = JSON.stringify(formattedData, null, '\t');
			setLines(parsedData.split('\n').map((l) => { return { content: l, isCollapsed: false } }));
		} else {
			setLines([{content: formattedData, isCollapsed: false }]);
		}
	}, [dataValue]);
	
	return (
		<div id={'Editor'}>
			{lines.map((line, i) => {
				const blockStartRegex = RegExp(/^(\s)*(.+\:\s)?\{$|^(\s)*(.+\:\s)?\[$/);
				const blockEndRegex = RegExp(/\](,)?$|\}(,)?/);

				return (
					<div key={i} className={'row'}>
						<div className={'col-1 border-r-2 bg-slate-100'}>
							<div className={'validation'}></div>
							<div className={'lineNumber'}>{i}</div>
							<div className={'toggle flex items-center'}>
								{!isEditing && blockStartRegex.test(line.content) && (
									<ToggleIcon isCollapsed={false} callback={() => console.log('toggle collapse...')} />
								)}
							</div>
						</div>
						<div className={`flex items-center bg-slate-100`}
							data-is-block-collapsed={false}>
								<Line>{line.content}</Line>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Editor;
