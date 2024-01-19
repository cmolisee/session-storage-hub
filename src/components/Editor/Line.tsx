import { ReactNode, useRef, useState } from "react";
import useAutosizeTextArea from "../../providers/useAutosizeTextArea";

interface ILineProps {
    children?: string
    isEdit?: boolean
}

const Line = ({ children, isEdit }: ILineProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState<string>(children as string)

    useAutosizeTextArea({ textAreaRef: textAreaRef.current, value});

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target?.value;

    setValue(val);
  };

    if (isEdit) {
        return (
            <textarea ref={textAreaRef}
                id={'edit'}
                style={{backgroundColor: 'transparent', resize: 'none', width: '100%'}}
                value={value}
                rows={1}
                onChange={handleChange} />
        );
    }

    return (
        <p>{value}</p>
    );
}

export default Line;