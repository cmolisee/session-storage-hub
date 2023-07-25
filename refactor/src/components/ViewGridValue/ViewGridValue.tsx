import { useStorageData } from "../../providers/useStorageData";
import { getDataAsFormattedJson } from "../../utils/Json-Utils";
import RenderData from "../RenderData";
import './ViewGridValue.scss';

interface IViewGridValueProps {};

// eslint-disable-next-line no-empty-pattern
const ViewGridValue = ({}: IViewGridValueProps) => {
    const {dataValue} = useStorageData();
    const data = getDataAsFormattedJson(dataValue);

    return (
        <div className={`ViewGridValue`}>
            {data && <RenderData data={data} />}
        </div>
    );
}

export default ViewGridValue;