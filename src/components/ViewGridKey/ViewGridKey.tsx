import './ViewGridKey.scss';
import { useStorageData } from "../../providers/useStorageData";

interface IViewGridKeyProps {
    keyName: string;
    callback: () => void;
}

const ViewGridKey = ({
    keyName,
    callback,
}: IViewGridKeyProps) => {
    const {selectedKeys, setSelectedKeys, dataKey} = useStorageData();

    const handleIsChecked = () => {
        return selectedKeys?.includes(keyName) ?? false;
    };

    const handleOnChange = () => {
        if (selectedKeys?.includes(keyName)) {
            setSelectedKeys(selectedKeys.filter((k) => k !== keyName))
        } else {
            setSelectedKeys([...selectedKeys as string[], keyName]);
        }
    };
    
    return (
        <div className={'ViewGridKey'} aria-selected={dataKey === keyName}>
            <input type={'checkbox'} 
                checked={handleIsChecked()} 
                onChange={handleOnChange}/>
            <p onClick={callback}>
                {keyName}
            </p>
        </div>
    );
}

export default ViewGridKey;