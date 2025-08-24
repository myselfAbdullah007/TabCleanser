// Background service worker for Cookie Cleaner extension
// Handles tab closure detection and automatic data cleaning

// Store tab information to track domains
const tabInfo = new Map();

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  whitelist: []
};

/**
 * Extract domain from URL
 * @param {string} url - The URL to extract domain from
 * @returns {string} The domain name
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    console.error('Error extracting domain from URL:', url, error);
    return null;
  }
}

/**
 * Check if domain is whitelisted
 * @param {string} domain - The domain to check
 * @param {Array} whitelist - Array of whitelisted domains
 * @returns {boolean} True if domain is whitelisted
 */
function isWhitelisted(domain, whitelist) {
  return whitelist.some(whitelistedDomain => {
    // Exact match
    if (whitelistedDomain === domain) return true;
    
    // Wildcard subdomain match (e.g., *.example.com)
    if (whitelistedDomain.startsWith('*.')) {
      const baseDomain = whitelistedDomain.slice(2);
      return domain === baseDomain || domain.endsWith('.' + baseDomain);
    }
    
    return false;
  });
}

/**
 * Clear all data for a specific domain
 * @param {string} domain - The domain to clear data for
 */
async function clearDomainData(domain) {
  try {
    console.log(`Clearing data for domain: ${domain}`);
    
    // Clear cookies for the domain
    const cookies = await chrome.cookies.getAll({ domain: domain });
    for (const cookie of cookies) {
      await chrome.cookies.remove({
        url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`,
        name: cookie.name,
        storeId: cookie.storeId
      });
    }
    
    // Clear browsing data for the domain
    const origin = `https://${domain}`;
    await chrome.browsingData.remove({
      origins: [origin]
    }, {
      appcache: true,
      cache: true,
      cacheStorage: true,
      cookies: true,
      downloads: false,
      fileSystems: true,
      formData: true,
      history: false,
      indexedDB: true,
      localStorage: true,
      passwords: false,
      serviceWorkers: true,
      webSQL: true
    });
    
    console.log(`Successfully cleared data for domain: ${domain}`);
  } catch (error) {
    console.error(`Error clearing data for domain ${domain}:`, error);
  }
}

/**
 * Handle tab updates to track domain information
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const domain = extractDomain(tab.url);
    if (domain) {
      tabInfo.set(tabId, {
        domain: domain,
        url: tab.url
      });
    }
  }
});

/**
 * Handle tab removal to trigger data cleaning
 */
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  try {
    // Get settings
    const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    
    // Check if auto-cleaner is enabled
    if (!settings.enabled) {
      console.log('Auto-cleaner is disabled');
      return;
    }
    
    // Get tab information
    const tabData = tabInfo.get(tabId);
    if (!tabData || !tabData.domain) {
      console.log('No domain information found for tab:', tabId);
      return;
    }
    
    // Check if domain is whitelisted
    if (isWhitelisted(tabData.domain, settings.whitelist)) {
      console.log(`Domain ${tabData.domain} is whitelisted, skipping cleanup`);
      return;
    }
    
    // Check if there are other tabs open for the same domain
    const tabs = await chrome.tabs.query({});
    const otherTabsForDomain = tabs.filter(tab => {
      if (tab.id === tabId) return false;
      const tabDomain = extractDomain(tab.url);
      return tabDomain === tabData.domain;
    });
    
    // Only clear data if no other tabs are open for the same domain
    if (otherTabsForDomain.length === 0) {
      console.log(`No other tabs open for domain ${tabData.domain}, clearing data`);
      await clearDomainData(tabData.domain);
    } else {
      console.log(`${otherTabsForDomain.length} other tabs still open for domain ${tabData.domain}, skipping cleanup`);
    }
    
    // Clean up tab info
    tabInfo.delete(tabId);
    
  } catch (error) {
    console.error('Error handling tab removal:', error);
  }
});

/**
 * Handle extension installation to set default settings
 */
chrome.runtime.onInstalled.addListener(async () => {
  try {
    // Set default settings if they don't exist
    const existingSettings = await chrome.storage.sync.get();
    const settingsToSet = {};
    
    if (!('enabled' in existingSettings)) {
      settingsToSet.enabled = DEFAULT_SETTINGS.enabled;
    }
    
    if (!('whitelist' in existingSettings)) {
      settingsToSet.whitelist = DEFAULT_SETTINGS.whitelist;
    }
    
    if (Object.keys(settingsToSet).length > 0) {
      await chrome.storage.sync.set(settingsToSet);
      console.log('Default settings initialized');
    }
  } catch (error) {
    console.error('Error initializing default settings:', error);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
      sendResponse(settings);
    });
    return true; // Indicates async response
  }
  
  if (request.action === 'updateSettings') {
    chrome.storage.sync.set(request.settings, () => {
      sendResponse({ success: true });
    });
    return true; // Indicates async response
  }
  
  if (request.action === 'cleanCurrentTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0] && tabs[0].url) {
        const domain = extractDomain(tabs[0].url);
        if (domain) {
          await clearDomainData(domain);
          sendResponse({ success: true, domain: domain });
        } else {
          sendResponse({ success: false, error: 'Could not extract domain' });
        }
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true; // Indicates async response
  }
}); 