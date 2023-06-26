import './List.scss';

interface IListProps extends React.OlHTMLAttributes<HTMLLIElement> {
    bullet: 'default' | 'dash';
}

const List = ({
    bullet = 'default',
    children,
    ...props
}: IListProps) => {
    return (
        <li className={`List List__${bullet}`} {...props}>
            {children}
        </li>
    );
}

export default List;