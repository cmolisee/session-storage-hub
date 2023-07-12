export const getCurrentTabUId = (callback: (id?: number) => void): void => {
    console.log('getCurrentTabUId');
    const queryInfo = {active: true, currentWindow: true};

    chrome.tabs && chrome.tabs.query(queryInfo, (tabs) => {
        console.log('tabs', tabs);
        // i think there is a known bug where the query scope is somehow beyond that of the tabs
        // thus it doesn't see the tabs anymore.

        // one maybe solution is to store the tabId in some kind of state when the popup renders as 
        // it will correctly get the tab on render.
        callback(tabs.length ? tabs[0].id : 0);
    });
}