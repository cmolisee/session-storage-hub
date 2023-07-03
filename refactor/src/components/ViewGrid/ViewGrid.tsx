import { useState, useEffect } from 'react';
import ViewGridKey from '../ViewGridKey';
import ViewGridValue from '../ViewGridValue';
import './ViewGrid.scss';

export interface IKeyValuePair {
    [key: string]: any;
}

interface IViewGridProps {
    className?: string;
    data?: IKeyValuePair[];
}

const ViewGrid = ({
    className,
    data = [
        {
            testKey1: 'value'
        },
        {
            testKey2: {
                a: ['a', 'b', 'c'],
                b: {
                    c: 'd'
                },
                c: 'd'
            }
        }
    ]
}: IViewGridProps) => {
    const [dataKeys, setDataKeys] = useState<string[]>([]);
    const [currentValue, setCurrentValue] = useState<any>();

    useEffect(() => {
      if (data && data.length) {
        setDataKeys(Object.keys(data));
        setCurrentValue(JSON.stringify(data[0]));
      }
    }, [])
    
    return (
        <div className={`ViewGrid ${className ?? ''}`}>
            <div className={'ViewGrid__30'}>
                {dataKeys && dataKeys.map((key, i) => {
                    return <ViewGridKey key={i} callback={() => {}}>{key}</ViewGridKey>
                })}
            </div>
            <div className={'ViewGrid__70'}>
                {currentValue && <ViewGridValue>{currentValue}</ViewGridValue>}
            </div>
        </div>
    );
}

export default ViewGrid;