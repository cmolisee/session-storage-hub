# Session Storage Hub

Current Version: v2.0.0

Chrome browser extension to easily view, copy, and paste session storage data from one tab to another.

---

How to install:

1. Copy or clone the main branch from this repo to a folder onto your local machine.
2. Open google chrome web browser and navigate to the chrome extension tab `chrome://extensions/`.
3. Turn on Developer Mode in the top right corner.
4. Select 'Load Unpacked'.
5. Select the 'src' folder of the extension.

---

Architecture Overview:

```
+---------+
| browser | <--- Service Worker <-------+
|         | <--- Content Script <-------+-- Manifest
+---------+ <--- Injected Script(s) <---+
```

Manifest contains extension configurations and permissions for all files.
Service Worker facilitates communication to/from web pages and the extension.
Content Script runs in the context of the web page and communicates information to the service worker.
Injected Scripts are scripts that get injected into the webpage DOM.

- This includes the session storage script which gets injected from the content script.

---

File Structure:

```
Session-Storage-Browser-Extension/
├─ src/
│  ├─ icons/
│  ├─ js/
│  │  ├─ content-script.js
│  │  ├─ ext-settings.js
│  │  ├─ json-viewer.js
│  │  ├─ service-worker.js
│  │  ├─ session-storage-script.js
│  ├─ options/
│  │  ├─ options.css
│  │  ├─ options.js
│  │  ├─ options.html
│  ├─ popup/
│  │  ├─ popup.css
│  │  ├─ popup.js
│  │  ├─ popup.html
│  ├─ manifest.json
├─ tests/
```
