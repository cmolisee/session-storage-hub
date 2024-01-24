import { useRef } from "react";
import useAutosizeTextArea from "../../providers/useAutosizeTextArea";

interface IEditFieldProps {
    className?: string;
    value: string;
    callback: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EditField = ({className, value, callback}: IEditFieldProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea({ textAreaRef: textAreaRef.current, value});
    
    return (
        <textarea ref={textAreaRef}
                id={'editField'}
                className={className}
                style={{backgroundColor: 'transparent', resize: 'none', width: '100%', boxSizing: 'border-box'}}
                value={value.replace('"', '')}
                rows={1}
                onChange={callback} />
    );
};

export default EditField;