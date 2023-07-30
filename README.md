# Session Storage Hub

### Current Version: v3.0.0

Chrome browser extension to easily view, copy, and paste session storage data
from one tab to another.

---

### How to install (easy):

1. Download the most up-to-date 'build' folder from the repository.
2. Open google chrome web browser and navigate to the chrome extension tab
   `chrome://extensions/`.
3. Turn on Developer Mode in the top right corner.
4. Select 'Load Unpacked'.
5. Select the 'build' folder of the extension.


### How to install (less-easy):

1. Copy or clone the main branch from this repo to a folder onto your local
   machine.
2. Open a terminal an `cd` into the folder.
3. Run `npm run build` and you should have a `build` folder generated.
4. Open google chrome web browser and navigate to the chrome extension tab
   `chrome://extensions/`.
5. Turn on Developer Mode in the top right corner.
6. Select 'Load Unpacked'.
7. Select the 'build' folder of the extension.

---

### How to Update (easy):

1. Download the most up-to-date 'build' folder from the repository and replacing your current saved folder.
2. Go to your browser and open the extension manager.
3. Select the 'Session Storage Hub' extension and click 'Update'.

_You may need to reload your browser or reload the pages you are trying to use
the browser on._

### How to Update (easy):

1. Go to your terminal and Navigate to where you have the extension folder saved.
2. Make sure you are on the 'main' branch by running `git checkout main`.
2. Run `git fetch && git pull` to update the folder.
3. While still in the terminal run `npm i && npm run build` to install the dependencies and update the 'build' folder.
4. Go to your browser and open the extension manager.
5. Select the 'Session Storage Hub' extension and click 'Update'.
6. You may need to reload your browser or reload the pages you are trying to use
   the browser on.

_You may need to reload your browser or reload the pages you are trying to use
the browser on._

---

### Usage:

Once the Extension is installed you can start using it on any tab in your browser.

You can pin the extension next to your browser search bar using the Extension Manager.

#### Selecting/unselecting Items to Copy

In the view area you will see grid with 2 columns. The left column displays the <u>keys</u> for all session storage objects. Object that are selected will display a green checkmark and objects that are not selected will display a red 'X'. You can select/unselect by doing the following:

1. Individually clicking on the checkmark or 'X' icon.
2. Clicking the 'select all' button above the column.
3. Clicking the 'unselect all' button above the column.

#### Copying/Pasting Items

To copy items just select all the items you want on the current browser tab and click the 'Copy' button at the top of the extension window. You will see a notification that items were successfuly coppied or if there was an error.

Once coppied you can now navigate to a new tab, open the extension, and click the 'Paste' button. Again, you will see a notification that items were successfuly pasted or if there was an error. Additionally, you should now see the newly pasted items in the grid in the extension window and in the dev tools window on the page.

#### Viewing Item Values

In the view area you will see grid with 2 columns. The right column displays the <u>values</u> for all session storage objects. To change which object you are viewing simply click on the corresponding items <u>key</u> in the right column (selected keys will be highlighted).

The view area will display values as follows:

* Any non-complex primitive values (strings, numbers, booleans, null, undefined, empty, etc...) will be openly visible in the view area (the right column).
* Objects will display the key value. By clicking on the key value the children to that key will be displayed.
* Arrays will display a preview of the contents in that array as the key value. By clicking on the key value preview the values will be displayed.