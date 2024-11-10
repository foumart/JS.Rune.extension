# Rune Dev Tools Extension

## Overview

While porting one of my games to the Rune platform, I constantly found myself browsing deeply through the project DOM tree in Chrome DevTools to locate specific game iframes. To streamline this process, I created a Chrome extension that speeds up the navigation to these iframes. Although the extension is simple, it serves as a solid foundation for future enhancements.

## Features

•  **Game iFrames reveal**: Click **`Game #1`** or **`Game #2`** buttons in the extension Popup to log the respective game iframe in the console.

*Note: Initially I wanted to have the DOM tree in the Elements tab of DevTools expand automatically, but it is not currently supported due to the requirement for experimental features to be enabled by the user. Will have see how to do it.*


### Installation

1. Clone the repository
2. Open Chrome and navigate to **`chrome://extensions/`**.
3. Enable **`Developer mode`** by toggling the switch in the top right corner.
4. Click **`Load unpacked`** and select the directory where you cloned the repository.

### Usage

1. Open your project in Chrome.
2. Click the Rune Dev Tools extension icon in the toolbar to open the extension Popup.
3. Clicking one of the buttons in the Popup will log the desired game iframe in the console.
