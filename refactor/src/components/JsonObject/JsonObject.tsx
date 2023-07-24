import { Fragment, MouseEvent, useState } from "react";
import { getDataAsFormattedJson, getDataType } from "../../utils/Json-Utils";
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
    const formattedData = getDataAsFormattedJson(data);
    const type = getDataType(formattedData);
    const [isHidden, setIsHidden] = useState<boolean[]>([]);

    const handleClick = (key: number) => (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('on click for: ', key);
        setIsHidden((prev) => {
            const updated = [...prev!];
            updated[key] = !updated[key];
            return updated;
        });
    }

    // useEffect(() => {
    //     if (!isHidden?.length) {
    //         if (formattedData && type === 'object') {
    //             const keys = Object.keys(formattedData);
    //             console.log('is an object and keys are: ', keys);
    //             console.log('key map: ', keys.map(() => true));
    //             setIsHidden(keys.map(() => true));
    //         }
    
    //         setIsHidden([true]);
    //     }
    // }, [formattedData])

    console.log('formattedData: ', formattedData);
    console.log('isHidden: ', isHidden);

    if (type === 'object') {
        return (
            <div className={`JsonObject ${className ?? ''}`}>
                {formattedData && Object.entries(formattedData).map((entry, i) => {
                        setIsHidden((prev) => [...prev, true]);
                        // TODO: issue with rendering here. we only have 1 state object and if we have an
                        // an object with multiple nested objects then that state will toggle both.
                        // we need a different way to toggle or a way to handle this use case.
                        return (
                            <Fragment key={`${entry[0]}_${i}`}>
                                <JsonKey onClickCallback={handleClick(i)} isHidden={isHidden ? isHidden[i] : true}>{entry[0]}</JsonKey>
                                {!(isHidden ? isHidden[i] : false) && <JsonObject data={entry[1]} />}
                            </Fragment>
                        );
                    })
                }
            </div>
        )
    }

    if (type === 'array') {
        setIsHidden((prev) => [...prev, true]);
        return (
            <div className={`JsonObject JsonObject__array ${className ?? ''}`}>
                <JsonKey onClickCallback={handleClick(0)} isHidden={isHidden ? isHidden[0] : true}>{`[${JSON.stringify(formattedData[0])}, ...]`}</JsonKey>
                {!(isHidden ? isHidden[0] : true) && (
                    formattedData as any[]).map((val: any, i) => {
                        const dataType = getDataType(val);
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