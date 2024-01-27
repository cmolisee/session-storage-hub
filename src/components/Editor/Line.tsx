import { ReactNode } from "react";

interface ILineProps {
    children: ReactNode;
};

const Line = ({ children }: ILineProps) => {

    return (
        <div className={'w-[90%] pl-[1em]'} >
            <pre className={'text-pretty'}>{children}</pre>
        </div>
    )
}

export default Line;