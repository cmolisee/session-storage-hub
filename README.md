<h1 align="center">Session Storage Hub</h1>
<p align="center">
  <a href="CONTRIBUTING.md">Contributing Guidelines</a>
  ·
  <a href="path to issues">Submit an Issue</a>
  <br>
</p>

<p align="center">
    Chrome browser extension to easily view, copy, and paste session storage data from one tab to another.
</p>
<p align="center">Author: Cody Molisee</p>

<p align="center">
  <a href="https://github.com/cmolisee/session-storage-hub/issues">
    <img src="https://img.shields.io/github/issues-raw/cmolisee/session-storage-hub" />
  </a>&nbsp;
  <a href="LICENSE.md">
    <img src="https://img.shields.io/github/license/cmolisee/session-storage-hub" />
  </a>&nbsp;
  <a href="https://github.com/cmolisee/session-storage-hub/releases">
    <img src="https://img.shields.io/github/release-date/cmolisee/session-storage-hub" />
  </a>&nbsp;
  <a href="https://github.com/cmolisee/session-storage-hub/releases/latest">
    <img src="https://img.shields.io/github/downloads/cmolisee/session-storage-hub/{{version}}/total" />
  </a>&nbsp;
  <a href="https://github.com/cmolisee/session-storage-hub">
    <img src="https://img.shields.io/github/languages/code-size/cmolisee/session-storage-hub" />
    </a>&nbsp;
    <a href="https://github.com/cmolisee/session-storage-hub">
        <img src="https://img.shields.io/github/package-json/v/cmolisee/session-storage-hub/main" />
    </a>
</p>

## Documentation

- [Installation](#installation)
- [Architecture](#architecture)
- [Issues](#issues)
- [Releases](https://github.com/cmolisee/session-storage-hub/releases)
- [Contributing](#contributing)

## Installation

### Via Github and Terminal

1. In your terminal pull the 'main' branch to your local in a location of your choice (i.e. 'Documents').
```
git clone https://github.com/cmolisee/session-storage-hub.git
```
2. Change directory to the location you cloned the repo in and install dependencies.
```
cd <location>
npm i
```
3. Build the project.
```
npm run build
```
4. Open your chrome browser and open the extension manager.
5. Turn on `Developer Mode` and select `Load upacked`.
6. Select the build folder in the location you built the project. You may need to restart the browser and/or reload tabs.

### Via Release Artifacts

1. Go to the [Releases](https://github.com/cmolisee/session-storage-hub/releases) page and download the Source Code .zip file from the latest release.
2. Unpack the .zip file into a location of your choice. It will include all source code including the pre-built latest version.
3. Open your chrome browser and open the extension manager.
4. Turn on `Developer Mode` and select `Load upacked`.
5. Select the build folder in the location you built the project. You may need to restart the browser and/or reload tabs.

### Upgrading

The extension will check for updates the first time you install or about every 5 hours since the last check. If a new version is available it will provide a link to the latest release at the bottom of the extenssion popup window. You can click on that link and follow the steps in the 'Release Artifacts' installation guide above.

Alternatively, if you can follow 'Github and Terminal' installation and pull the latest version from main.

### Basic Usage

See the [usage](USAGE.md) documentation on how to use this extension.

## Architecture

This extension is built primarily with react, typescript, and sass.

Chrome api's are used extensively for browser, tab, and storage functionality and interaction.

The extension injects a service worker ('background.js') via the manifest file to each webpage in order to read and write session storage data for each tab. Communication between the service worker and the extension is handled by the content script.

All necessary files are minified and pacakged into the build folder.

## Issues

If you have questions, found a bug, or have an idea on a future additon you can start a [discussion](https://github.com/cmolisee/session-storage-hub/discussions).

## Releases

All releases including the latest release can be found [here](https://github.com/cmolisee/session-storage-hub/releases).

## Contributing

Read through our [contributing guidelines](CONTRIBUTE.md) to learn about our submission process, coding conventions, and other information.

## Want to Help or have a Suggestion?

To report a bug or submit an idea for a future change? Read the [contribution guidelines](CONTRIBUTE.md), check out the repo issues section, or try the [Discussion Forum](https://github.com/cmolisee/session-storage-hub/discussions).
