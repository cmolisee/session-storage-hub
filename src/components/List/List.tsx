import './List.scss';

interface IListProps extends React.OlHTMLAttributes<HTMLOListElement> {
    bullet: 'default' | 'dash';
}

const List = ({
    bullet = 'default',
    children,
    ...props
}: IListProps) => {
    return (
        <ol className={`List List__${bullet}`} {...props}>
            {children}
        </ol>
    );
}

export default List;