import './Button.scss';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    version?: 'default' | 'link';
    onClickCallback: () => void;
}

const Button = ({ 
    version = 'default', 
    className, 
    onClickCallback,
    ...props
}: IButtonProps) => {
    return (
        <button className={`Button Button__${version} ${className ?? ''}`} 
            {...props} 
            onClick={onClickCallback}>
            {props.children}
        </button>
    );
}

export default Button;
