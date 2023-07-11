import { Fragment } from "react";
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

    if (type === 'object') {
        return (
            <div className={`JsonObject ${className as string}`}>
                {formattedData && Object.entries(formattedData).map((entry, i) => {
                        return (
                            <Fragment key={`${entry[0]}_${i}`}>
                                <JsonKey>{entry[0]}</JsonKey>
                                <JsonObject data={entry[1]} />
                            </Fragment>
                        );
                    })
                }
            </div>
        )
    }

    if (type === 'array') {
        return <div className={`JsonObject JsonObject__array ${className as string}`}>
            <JsonKey>{`[${formattedData[0].split(0,5)}, ...]`}</JsonKey>
            {(formattedData as any[]).map((val: any, i) => {
                    return <JsonObject key={i} data={val} />;
            })}
        </div>;
    }

    if (type.match(/^(string|number|boolean|null)$/)) {
        return <JsonValue className={`JsonValue--${type}`}>{formattedData as string}</JsonValue>;
    }

    return <></>;
}

export default JsonObject;