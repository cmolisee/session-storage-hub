import { useEffect, useMemo } from "react";

interface IUseAutosizeTextArea {
  textAreaRef: HTMLTextAreaElement | null,
  value: string
}

const useAutosizeTextArea = ({ textAreaRef, value }: IUseAutosizeTextArea) => {
  // save the previous props to reduce unnecessary rerenders
  const prevProps = useMemo(() => ({ textAreaRef, value }), [textAreaRef, value]);
  
  useEffect(() => {
    const isNewProps = prevProps.textAreaRef !== textAreaRef || prevProps.value !== value;
    if (textAreaRef && isNewProps) {
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [prevProps, textAreaRef, value]);
};

export default useAutosizeTextArea;