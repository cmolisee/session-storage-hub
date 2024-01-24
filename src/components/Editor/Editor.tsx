import React, { ReactNode, useEffect, useState } from "react";
import "./styles.css";
import Line from "./Line";
import ToggleIcon from "./ToggleIcon";
import { getDataType } from "../../utils/Utils";
import { TDataTypes } from "../../types/types";
import EditorControls from "./EditorControls";

interface IEditorProps {
	children?: ReactNode
}

type TParsedLineType = { indent: number, content: string, isCollapsed: boolean, dataType: TDataTypes };
type TCollapsedRange = { start: number, end: number };

const Editor = ({ children }: IEditorProps) => {
	const [lines, setLines] = useState<TParsedLineType[]>([]);
	const [lineInEdit, setLineInEdit] = useState<number>(-1);

	useEffect(() => {
		const parsedLines = parseDataToEditorLines(children);
		setLines(parsedLines);
	}, [children]);

	const parseDataToEditorLines = (data: any, Editorlines: TParsedLineType[] = [], indent: number = 1) => {
		const dataType: TDataTypes = getDataType(data);

		if (dataType === 'none') {
			Editorlines.push({
				indent: indent, 
				content: 'null',
				isCollapsed: false,
				dataType: dataType
			});
		} else if (dataType === 'array') {
			Editorlines.push({ 
				indent: indent, 
				content: '[',
				isCollapsed: false,
				dataType: dataType
			});

			(data as any[]).forEach((child) => { parseDataToEditorLines(child, Editorlines, indent + 2) });
			
			Editorlines.push({ 
				indent: indent, 
				content: ']',
				isCollapsed: false,
				dataType: 'none'
			});
		} else if (dataType === 'object') {
			Object.keys(data).forEach((key) => {
				Editorlines.push({
					indent: indent,
					content: `${key}: {`,
					isCollapsed: false,
					dataType: dataType
				});

				parseDataToEditorLines(data[key], Editorlines, indent + 2);

				Editorlines.push({
					indent: indent,
					content: '}',
					isCollapsed: false,
					dataType: 'none'
				});
			});
		} else { // string, number, boolean
			Editorlines.push({ 
				indent: indent, 
				content: data, 
				isCollapsed: false, 
				dataType: dataType 
			});
		}

		return Editorlines;
	};

	const isIndexCollapsed = (i: number) => {
		if (i === null || i === undefined) {
			throw new Error('isIndexCollapsed: missing arguments...');
		}

		if (i < 0 || i > lines.length) {
			throw new Error('isIndexCollapsed: argument out of range...');
		}

		return lines[i].isCollapsed;
	};

	const getBracketFromIndex = (i: number) => {
		if (i === null || i === undefined) {
			throw new Error('getBracketFromIndex: missing arguments...');
		}

		if (i < 0 || i > lines.length) {
			throw new Error('getBracketFromIndex: argument out of range...');
		}

		const match = lines[i]?.content.match(/\{|\[|\]|\}/);
		return match?.length ? match[0] : null;
	};

	const getCollapseBlockRange = (i: number): TCollapsedRange | null => {
		if (i === null || i === undefined) {
			throw new Error('getCollapseBlockRange: missing arguments...');
		}

		if (i < 0 || i > lines.length) {
			throw new Error('getCollapseBlockRange: argument out of range...');
		}

		const bracket = getBracketFromIndex(i);
		
		if (!bracket || !/\{|\[/.exec(bracket) || isIndexCollapsed(i)) {
			return null;
		}

		let sum = 1;
		let k = i + 1;
		while (sum !== 0 && k < lines.length) {
			if (/\{|\[/.exec(lines[k].content)) {
				sum += 1;
			} else if (/\}|\]/.exec(lines[k].content)) {
				sum -= 1;
			}

			k += 1;
		}

		return { start: i + 1, end: k - 1};
	};

	const handleBlockToggle = (i: number, setToCollapsed: boolean) => {
		if (i === null || i === undefined || setToCollapsed === null || setToCollapsed === undefined) {
			throw new Error('handleBlockToggle: missing arguments...');
		}

		if (i < 0 || i > lines.length) {
			throw new Error('handleBlockToggle: argument out of range...');
		}

		const range = getCollapseBlockRange(i);

		if (!range) {
			return null;
		}

		setLines((prev) => {
			return [...prev].map((l, i) => {
				if (i >= range.start && i <= range.end) {
					return {...l, isCollapsed: setToCollapsed};
				}

				return l;
			});
		});
	};
	
	return (
		<div id={'Editor'}>
			<div className={'grid grid-cols-12 gapx-4'}>
				{lines.map((line: TParsedLineType, i) => {
					const isCollapsable = ['object', 'array'].includes(line.dataType);
					const isLastIndex = i === lines.length - 1
					const isStartOfCollapsedBlock = !isLastIndex && isIndexCollapsed(i + 1);
					const isMemberOfCollapsedBlock = isStartOfCollapsedBlock || isIndexCollapsed(i);

					if (isIndexCollapsed(i)) {
						return <></>;
					}

					return (
						<React.Fragment key={i}>
							<div className={'LineNumber col-span-1 border-r-2 bg-slate-100'}>
								<div className={'grid grid-cols-3'}>
									<div className={'validationCol col-span-1'}></div>
									<div className={'col-span-1'}>{i}</div>
									<div className={'validationCol col-span-1 flex items-center'}>
										{isCollapsable && (
											<ToggleIcon isCollapsed={isMemberOfCollapsedBlock} 
												callback={() => handleBlockToggle(i, !isMemberOfCollapsedBlock)} />
										)}
									</div>
								</div>
							</div>
							<div className={`col-span-11 flex items-center bg-slate-100 min-h-[30px]`}
								data-is-block-collapsed={isStartOfCollapsedBlock}
								style={{paddingLeft: `${line.indent}em`}}
								onClick={() => !isMemberOfCollapsedBlock && setLineInEdit(i)}>
									<Line isEdit={lineInEdit === i} dataType={line.dataType}>{`${line.content}${isStartOfCollapsedBlock ? '...' : ''}`}</Line>
							</div>
						</React.Fragment>
					);
				})}
			</div>
			{lineInEdit > -1 && (<EditorControls saveCallback={() => console.log('save')}  cancelCallback={() => console.log('cancel')}/>)}
		</div>
	);
};

export default Editor;
