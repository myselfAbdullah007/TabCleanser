# Tab Cleanser

<div align="center">
  <img src="icons/icon128.png" alt="Tab Cleanser Icon" width="128" height="128">
  <br>
  <strong>A simple Chrome and Firefox extension that deletes all cookies from all domains with a single click.</strong>
</div>

## What it does

Tab Cleanser helps you clear all cookies from your browser instantly. This is useful for:
- Privacy protection
- Testing websites
- Clearing login sessions
- Removing tracking cookies

## How to install

### Chrome/Edge
1. Go to `chrome://extensions/`
2. Turn on "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the Extension folder
5. The Tab Cleanser icon should appear in your browser toolbar

### Firefox
1. Go to `about:addons`
2. Click the gear icon → "Debug Add-ons"
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the Extension folder
5. The Tab Cleanser icon should appear in your browser toolbar

## How to use

### Method 1: Click the extension icon
1. Look for the Tab Cleanser icon in your browser toolbar
2. Click it once
3. You'll see a notification saying "All cookies cleared!"
4. All cookies from all websites are now deleted

### Method 2: Use the JavaScript command
1. Open any website
2. Press F12 to open developer tools
3. Go to the Console tab
4. Type: `window.postMessage({ type: "CLEAR_COOKIES_EXTENSION_API" }, "*");`
5. Press Enter
6. You'll see a green notification on the page saying "All cookies cleared!"

## What happens when you use it

- All cookies from all websites are deleted
- You'll be logged out of all websites
- You'll see a notification confirming the action
- The extension works on any website

## Browser support

- Chrome 88 or newer
- Edge 88 or newer  
- Firefox 109 or newer

## Troubleshooting

If the extension doesn't work:
1. Make sure it's installed properly
2. Check that the extension is enabled in your browser
3. Try clicking the extension icon again
4. Check if you see any error messages

## Privacy

- The extension only deletes cookies
- It doesn't collect any data
- It doesn't track your browsing
- All settings are stored locally on your device 