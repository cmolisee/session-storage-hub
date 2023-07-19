import { useStorageData } from "../../providers/useStorageData";
import JsonObject from "../JsonObject";
import './ViewGridValue.scss';

interface IViewGridValueProps {
    className?: string;
}

const ViewGridValue = ({
    className,
}: IViewGridValueProps) => {
    const {dataValue} = useStorageData();
    
    return (
        <div className={`ViewGridValue ${className ?? ''}`}>
            <JsonObject data={dataValue} />
        </div>
    );
}

export default ViewGridValue;