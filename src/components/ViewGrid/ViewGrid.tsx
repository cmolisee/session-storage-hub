import './ViewGrid.css';
import { useStorageData } from '../../providers/useStorageData';
import { publishEvent } from '../../utils/CustomEvents';
import ViewGridKey from '../ViewGridKey/ViewGridKey';
import ViewGridValue from '../ViewGridValue/ViewGridValue';
import Control from '../Control/Control';

interface IViewGridProps {
	className?: string;
}

const ViewGrid = ({ className }: IViewGridProps) => {
	const {
		isEditing,
		keys,
	} = useStorageData();
	const isEditingStyles = 'absolute right-0 font-bold text-[var(--borderColor)]';


	const handleSaveCallback = () => {
		publishEvent('SaveEdits', {});
	};

	const handleCancelCallback = () => {
		publishEvent('CancelEdits', {});
	};

	return (
		<>
			<div className={`ViewGrid ${className ?? ''}`}>
				<div className={'ViewGrid__30'}>
					{keys &&
						keys.map((key, i) => {
							return (
								<ViewGridKey
									key={i}
									keyName={key}
								/>
							);
						})}
				</div>
				<div className={'ViewGrid__70'}>
					<ViewGridValue />
				</div>
			</div>
			{isEditing && (
				<div
					className={isEditingStyles}>
					<Control
						className={'hover:text-green-300'}
						onClickCallback={handleSaveCallback}>
						Submit Edits
					</Control>
					<Control
						className={'hover:text-red-300 bold'}
						onClickCallback={handleCancelCallback}>
						Cancel Edits
					</Control>
				</div>
			)}
		</>
	);
};

export default ViewGrid;
