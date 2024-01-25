import "./styles.css";

interface IToggleIconProps {
    isCollapsed?: boolean
    callback: () => void
}

const ToggleIcon = ({ isCollapsed, callback }: IToggleIconProps) => {
    if (isCollapsed) {
        return (
            <div className={'toggleIcon flex justify-center w-4 h-4'} onClick={() => callback()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                </svg>

            </div>
            

        );
    }

    return (
        <div className={'toggleIcon flex justify-center w-4 h-4 opacity-0'} onClick={() => callback()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
            </svg>
        </div>

    );  
}

export default ToggleIcon;