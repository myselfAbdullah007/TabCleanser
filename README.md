# Tab Cleanser

A simple Chrome and Firefox extension that deletes all cookies from all domains with a single click.

## Features

- **One-Click Cookie Deletion**: Click the extension icon to clear all cookies from all domains
- **JavaScript API**: Programmatically clear cookies from any webpage
- **Toast Notifications**: Get instant feedback when cookies are cleared
- **Privacy Focused**: Useful for automated testing and privacy protection
- **Cross-Browser**: Works with Chrome, Edge, and Firefox

## Installation

### Chrome/Edge
1. Go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the Extension folder containing `manifest.json`
5. Verify "Tab Cleanser" appears in the extensions list

### Firefox
1. Go to `about:addons`
2. Click the gear icon → "Debug Add-ons"
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the Extension folder
5. Verify "Tab Cleanser" appears in the list

## Usage

### Method 1: Extension Icon Click
Click the Tab Cleanser extension icon in your browser toolbar to delete all cookies from all domains. You'll see a toast notification confirming the action.

### Method 2: JavaScript API (All Domains)
Use JavaScript to delete all cookies from all domains via the extension API:

```javascript
window.postMessage({ type: "CLEAR_COOKIES_EXTENSION_API" }, "*");
```

### Method 3: JavaScript API (Current Domain Only)
Use JavaScript to delete cookies visible to JavaScript for the current domain:

```javascript
window.postMessage({ type: "CLEAR_COOKIES_DOCUMENT" }, "*");
```

### Receive Notifications
Listen for notifications when cookies have been cleared:

```javascript
window.addEventListener("message", function (event) {
    if (event.data.type && (event.data.type === "COOKIES_CLEARED_VIA_EXTENSION_API")) {
        // Cookies have been cleared via extension API
        console.log("All cookies cleared!");
    }
});
```

## File Structure

```
Extension/
├── manifest.json          # Extension manifest
├── background.js          # Background service worker
├── content.js            # Content script for webpage integration
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Permissions

The extension requires the following permissions:
- `cookies`: To access and delete cookies
- `activeTab`: To interact with the current tab
- `notifications`: To show toast notifications
- `<all_urls>`: To work on all websites

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Firefox 109+

## Testing

To test the extension:

1. **Install the extension** following the installation steps above
2. **Click the extension icon** in your browser toolbar
3. **Check for toast notifications** - you should see a green notification saying "All cookies cleared!"
4. **Test JavaScript API** on any website:
   ```javascript
   // Clear all cookies
   window.postMessage({ type: "CLEAR_COOKIES_EXTENSION_API" }, "*");
   ```

## License

MIT License 