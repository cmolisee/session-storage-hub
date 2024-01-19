import { useEffect } from "react";

interface IUseAutosizeTextArea {
  textAreaRef: HTMLTextAreaElement | null,
  value: string
}

const useAutosizeTextArea = ({ textAreaRef, value }: IUseAutosizeTextArea) => {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};

export default useAutosizeTextArea;