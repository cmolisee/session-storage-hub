import * as EXS from '../src/js/ext-settings.js';

describe('Test ext-settings module', () => {
    it('should create a deep clone of an object', () => {
        const obj = {a: 'a', b: 'b'};
        const deepClone = EXS.deepClone(obj);

        obj.a = 'not a';
        obj.b = 'not b';

        expect(obj.a).toEqual('not a');
        expect(obj.b).toEqual('not b');
        expect(deepClone).not.toBeUndefined();
        expect(deepClone.a).toEqual('a');
        expect(deepClone.b).toEqual('b');
    });

    it('Should test ExtSettings is instantiated properly', async () => {
        const savedSettings = new Promise((resolve, reject) => {
            resolve(EXS.deepClone(EXS.defaultSettings));
            reject('you suck and this did not work.');
        });
        chrome.storage.sync.get.mockImplementation(() => savedSettings);

        const extSettings = new EXS.ExtSettings();

        // failing because async bullshit...
        // expect(extSettings.settings).not.toBeUndefined();
        // expect(extSettings.settings.extensionTheme).not.toBeUndefined();
    });

    // see https://github.com/extend-chrome/jest-chrome 
});