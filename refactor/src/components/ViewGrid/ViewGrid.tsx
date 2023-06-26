import './ViewGrid.scss';

interface IViewGridProps {
    className?: string;
}

const ViewGrid = ({
    className,
}: IViewGridProps) => {
    return (
        <div className={`ViewGrid ${className ?? ''}`}>
            <div className={'ViewGrid__30'}></div>
            <div className={'ViewGrid__70'}></div>
        </div>
    )
}

export default ViewGrid;