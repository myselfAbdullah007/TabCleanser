# 🧹 Tab Cleanser Extension

<div align="center">
  <img src="icons/icon128.png" alt="Tab Cleanser Icon" width="128" height="128">
  <br>
  <strong>A Chrome and Firefox extension that automatically clears cookies, local storage, session storage, and cache when tabs are closed</strong>
  <br>
  <em>Helping you maintain privacy and free up storage space</em>
  
  <br><br>
  
  ![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-brightgreen?style=for-the-badge&logo=google-chrome)
  ![Firefox Add-ons](https://img.shields.io/badge/Firefox-Add--on-orange?style=for-the-badge&logo=firefox-browser)
  ![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
  ![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
</div>

## ✨ Features

- 🧹 **Automatic Cleaning**: Clears site data when tabs are closed
- 🎯 **Smart Domain Detection**: Only cleans data for the specific domain of the closed tab
- ⚪ **Whitelist Management**: Keep data for trusted domains
- 🚀 **Manual Cleaning**: Clean current tab's data with one click
- 🌐 **Cross-Browser Support**: Works on both Chrome and Firefox
- 🔒 **Privacy Focused**: No data collection or tracking

## 🚀 Installation

### Chrome Installation

1. **Download the Extension**
   ```bash
   git clone https://github.com/myselfAbdullah007/TabCleanser.git
   cd TabCleanser
   ```

2. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder

3. **Pin the Extension**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Tab Cleanser" and click the pin icon

### Firefox Installation

1. **Load Extension in Firefox**
   - Open Firefox and go to `about:debugging`
   - Click "This Firefox" tab
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the extension folder

2. **Pin the Extension**
   - Click the hamburger menu → "Add-ons and themes"
   - Find "Tab Cleanser" and click "Pin to Toolbar"

## 📋 Requirements

### Requirements

All required files are included in the extension directory. The extension is ready to install and use.

## 🎯 Usage

### Basic Usage

1. **Enable Auto Cleaner**
   - Click the Tab Cleanser extension icon
   - Toggle "Auto Cleaner" to ON
   - The extension will now automatically clean data when you close tabs

2. **Manual Cleaning**
   - Click the extension icon
   - Click "Clean Current Tab" to immediately clear data for the current site



### Whitelist Management

1. **Add Trusted Domains**
   - In the extension popup, enter a domain (e.g., `example.com`)
   - Click "Add" to whitelist it
   - Whitelisted domains won't be automatically cleaned

2. **Remove from Whitelist**
   - Click the "×" button next to any whitelisted domain
   - The domain will be removed from the whitelist

### Domain Format Examples

- `example.com` - Exact domain match
- `*.example.com` - All subdomains of example.com
- `google.com` - Google's main domain
- `github.com` - GitHub's domain

## 🔧 Technical Details

### Manifest Version
- Uses Manifest V3 for Chrome compatibility
- Includes Firefox-specific settings for cross-browser support

### Permissions Required
- `storage` - Save user settings
- `tabs` - Monitor tab events
- `cookies` - Clear cookies
- `browsingData` - Clear storage and cache
- `activeTab` - Access current tab information

### Data Cleared
When a tab is closed, the extension clears:
- Cookies
- Local Storage
- Session Storage
- Cache
- IndexedDB
- Service Workers
- App Cache
- File Systems
- Form Data

### Smart Cleaning Logic
- Only cleans data if no other tabs are open for the same domain
- Respects whitelist settings
- Handles subdomain wildcards
- Provides detailed console logging for debugging

## 🛠️ Development

### File Structure
```
TabCleanser/
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── popup.html            # Popup interface
├── popup.js              # Popup logic
├── styles.css            # Styling
├── icons/                # Extension icons
├── test.html             # Test page
├── package.json          # Project metadata
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

### Key Functions

#### Background Service Worker (`background.js`)
- `extractDomain(url)` - Extract domain from URL
- `isWhitelisted(domain, whitelist)` - Check whitelist status
- `clearDomainData(domain)` - Clear all data for a domain
- Tab event listeners for monitoring and cleaning

#### Popup Interface (`popup.js`)
- `loadSettings()` - Load user settings
- `saveSettings()` - Save user settings
- `updateWhitelistDisplay()` - Update whitelist UI
- `cleanCurrentTab()` - Manual cleaning function

### Browser Compatibility
- **Chrome**: Version 88+ (Manifest V3 support)
- **Firefox**: Version 109+ (Manifest V3 support)

## 🔒 Privacy & Security

- **No Data Collection**: The extension doesn't collect or transmit any user data
- **Local Storage**: All settings are stored locally using `chrome.storage.sync`
- **Domain-Specific**: Only cleans data for the specific domain of closed tabs
- **Transparent**: All actions are logged to console for transparency

## 🐛 Troubleshooting

### Extension Not Working
1. Check if auto-cleaner is enabled in the popup
2. Verify the domain isn't in the whitelist
3. Check browser console for error messages
4. Ensure all permissions are granted

### Icons Not Showing
1. Verify all icon files exist in the `icons/` directory
2. Check icon file sizes match requirements
3. Reload the extension after adding icons

### Settings Not Saving
1. Check if `chrome.storage.sync` is available
2. Verify extension permissions include `storage`
3. Try refreshing the popup

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Create an issue in the project repository

---

**Note**: This extension is designed for privacy-conscious users who want to automatically clear browsing data. Use responsibly and ensure you understand which data will be cleared. 