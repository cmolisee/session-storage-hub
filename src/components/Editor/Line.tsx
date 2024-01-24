import { useState } from "react";
import EditField from "./EditField";
import { TDataTypes } from "../../types/types";

interface ILineProps {
    children?: string;
    isEdit?: boolean;
    dataType: TDataTypes;
};

const Line = ({ children, isEdit, dataType }: ILineProps) => {
    const [value, setValue] = useState<string>(children as string);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target?.value;
        setValue(val);
    };

    return (
        <div className={`data-${dataType} w-full`}>
            {isEdit ? (
                <EditField value={value} callback={handleChange} />
            ) : (
                <p>{value}</p>
            )}
        </div>
    )
}

export default Line;