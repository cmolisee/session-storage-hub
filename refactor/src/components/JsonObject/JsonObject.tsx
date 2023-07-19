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

    console.log('data: ', formattedData);
    console.log('type: ', type);

    if (type === 'object') {
        return (
            <div className={`JsonObject ${className ?? ''}`}>
                {formattedData && Object.entries(formattedData).map((entry, i) => {
                        // TODO: issue with rendering here. we only have 1 state object and if we have an
                        // an object with multiple nested objects then that state will toggle both.
                        // we need a different way to toggle or a way to handle this use case.
                        return (
                            <Fragment key={`${entry[0]}_${i}`}>
                                <JsonKey onClickCallback={handleClick} isHidden={isHidden}>{entry[0]}</JsonKey>
                                {!isHidden && <JsonObject data={entry[1]} />}
                            </Fragment>
                        );
                    })
                }
            </div>
        )
    }

    if (type === 'array') {
        return (
            <div className={`JsonObject JsonObject__array ${className ?? ''}`}>
                <JsonKey onClickCallback={handleClick} isHidden={isHidden}>{`[${JSON.stringify(formattedData[0])}, ...]`}</JsonKey>
                {!isHidden && (
                    formattedData as any[]).map((val: any, i) => {
                        const dataType = getObjectType(val);
                        console.log(dataType);
                        return <JsonObject key={i} data={!dataType.match(/^(object|array)$/) ? {[i]: val} : val} />;
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