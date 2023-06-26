import Button from "../components/Button/Button";
import Header from '../components/Header/Header';
import List from "../components/List";
import ViewGrid from "../components/ViewGrid";

const Popup = () => {
    const optionsLink = <Button version={'link'} onClickCallback={() => console.log('options')}>Options</Button>;

    return (
        <>
            <Header title={'Session Storage Hub'} versionNumber={'2.1.1'} link={optionsLink} />
            <Button onClickCallback={() => console.log('copy')}>Copy</Button>
            <Button onClickCallback={() => console.log('paste')}>Paste</Button>
            <List bullet={'dash'}>
                <li>{'Use the checkboxes to include or exclude the corresponding session storage object/item.'}</li>
                <li>{'Expand/Close the JSON items in the viewing area to the left by clicking them.'}</li>
            </List>
            <span>
                <Button version={'link'} onClickCallback={() => console.log('select all')}>Select All</Button>
                <Button version={'link'} onClickCallback={() => console.log('unselect all')}>Unselect All</Button>
            </span>
            <ViewGrid></ViewGrid>
        </>
    );
}

export default Popup;