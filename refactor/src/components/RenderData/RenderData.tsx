import { Fragment } from 'react'
import { getDataType } from '../../utils/Json-Utils';
import DataItem from '../DataItem';

interface IRenderDataProps {
    data: any;
    isOpen?: boolean;
}

const renderObject = (data: object, isOpen: boolean = false) => {
    return <>{JSON.stringify(data)}</>
}

const renderArray = (data: any[], isOpen: boolean = false) => {
    const buildKeyString = (arr: any[]) => {
        const key = arr.toString();

        if (key.length > 20) {
            const formatted = key.substring(0, 20);
            const lastComma = formatted.lastIndexOf(',');
            return `[${lastComma > 0 ? formatted.substring(0, lastComma) : formatted},...]`;
        }

        return `[${key}]`;
    };

    console.log('data array key: ', buildKeyString(data));

    return (
        <DataItem dataId={'arrayData'}
            dataKey={buildKeyString(data)}
            isOpen={isOpen}>
            {data.map((arrayData, i) => <RenderData key={i} data={arrayData} />)}
        </DataItem>
    )
}

const RenderData = ({
    data,
    isOpen = false,
}: IRenderDataProps) => {
    const dataType = getDataType(data);

    if (dataType === 'object') {
        return renderObject(data, isOpen);
    } else if (dataType === 'array') {
        console.log('rendering array data with: ', data, isOpen);
        return renderArray(data, isOpen);
    }

    return (
        <DataItem dataId={'primitiveData'}
            isOpen={true}>
            {data}
        </DataItem>
    )
}

export default RenderData;