import { Fragment } from 'react'
import { getDataType } from '../../utils/Json-Utils';
import DataItem from '../DataItem';

interface IRenderDataProps {
    data: any;
    isExpanded?: boolean;
}

const renderObject = (data: object, isExpanded: boolean = false) => {
    return <>{JSON.stringify(data)}</>
}

const renderArray = (data: any[], isExpanded: boolean = false) => {
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
        <DataItem id={'arrayData'}
            key={buildKeyString(data)}
            isExpanded={isExpanded}>
            {data.map((arrayData, i) => <Fragment key={i}>{RenderData(arrayData)}</Fragment>)}
        </DataItem>
    )
}

const RenderData = ({
    data,
    isExpanded = false,
}: IRenderDataProps) => {
    const dataType = getDataType(data);

    if (dataType === 'object') {
        return renderObject(data, isExpanded);
    } else if (dataType === 'array') {
        console.log('rendering array data with: ', data, isExpanded);
        return renderArray(data, isExpanded);
    }

    return (
        <DataItem id={'primitiveData'}
            isExpanded={true}>
            {data}
        </DataItem>
    )
}

export default RenderData;