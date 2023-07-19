import { Fragment, MouseEvent, useState } from "react";
import { getFormatedJson, getObjectType } from "../../utils/Json-Utils";
import JsonKey from "../JsonKey";
import JsonValue from "../JsonValue";
import './JsonObject.scss';

interface IJsonObjectProps {
    className?: string;
    data?: any;
}

const JsonObject = ({
    className,
    data,
}:IJsonObjectProps) => {
    const formattedData = getFormatedJson(data);
    const type = getObjectType(formattedData);
    const [isHidden, setIsHidden] = useState(true);

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsHidden(prev => !prev);
    }

    if (type === 'object') {
        return (
            <div className={`JsonObject ${className as string}`}>
                {formattedData && Object.entries(formattedData).map((entry, i) => {
                    const isNotAnObject = getObjectType(entry[1]).match(/^(string|number|boolean|null)$/);

                        return (
                            <Fragment key={`${entry[0]}_${i}`}>
                                <JsonKey onClickCallback={handleClick}>{entry[0]}</JsonKey>
                                {(!isHidden || isNotAnObject) && <JsonObject data={entry[1]} />}
                            </Fragment>
                        );
                    })
                }
            </div>
        )
    }

    if (type === 'array') {
        const isArrayOfObjects = getObjectType((formattedData as any[])[0]);
        return (
            <div className={`JsonObject JsonObject__array ${className as string}`}>
                <JsonKey onClickCallback={handleClick}>{`[${formattedData[0].split(0,5)}, ...]`}</JsonKey>
                {/* Array of primitives */}
                {!isHidden && isArrayOfObjects !== 'object' && (
                    <JsonValue className={`JsonValue--string`}>
                        {(formattedData as any[]).join(', ')}
                    </JsonValue>
                )}
                {/* Array of objects */}
                {/* TODO: there is an error when dealing with an array of arrays */}
                {!isHidden && (
                    formattedData as any[]).map((val: any, i) => {
                        return <JsonObject key={i} data={val} />;
                })}
            </div>
        );
    }

    if (type.match(/^(string|number|boolean|null)$/)) {
        return <JsonValue className={`JsonValue--${type}`}>{formattedData as string}</JsonValue>;
    }

    return <></>;
}

export default JsonObject;