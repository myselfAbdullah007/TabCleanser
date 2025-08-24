// Tab Cleanser - Background Service Worker

// Listen for extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  try {
    console.log('[Tab Cleanser] Extension icon clicked, deleting all cookies');
    await deleteAllCookies();
    console.log('[Tab Cleanser] All cookies deleted successfully');
    
    // Show notification to user
    showNotification('All cookies cleared!', 'success');
  } catch (error) {
    console.error('[Tab Cleanser] Error deleting cookies:', error);
    showNotification('Error clearing cookies', 'error');
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CLEAR_COOKIES_EXTENSION_API") {
    console.log('[Tab Cleanser] Received request to clear all cookies via extension API');
    deleteAllCookies().then(() => {
      console.log('[Tab Cleanser] All cookies cleared via extension API');
      // Notify content script that cookies have been cleared
      chrome.tabs.sendMessage(sender.tab.id, { type: "COOKIES_CLEARED_VIA_EXTENSION_API" });
      // Show notification to user
      showNotification('All cookies cleared!', 'success');
    }).catch((error) => {
      console.error('[Tab Cleanser] Error clearing cookies via extension API:', error);
      showNotification('Error clearing cookies', 'error');
    });
    return true; // Keep the message channel open for async response
  }
});

/**
 * Delete all cookies from all domains
 */
async function deleteAllCookies() {
  try {
    console.log('[Tab Cleanser] Starting to delete all cookies');
    
    // Get all cookies
    const allCookies = await chrome.cookies.getAll({});
    console.log(`[Tab Cleanser] Found ${allCookies.length} cookies to delete`);
    
    // Delete each cookie
    const deletePromises = allCookies.map(async (cookie) => {
      try {
        const url = `${cookie.secure ? 'https' : 'http'}://${cookie.domain}${cookie.path}`;
        await chrome.cookies.remove({
          url: url,
          name: cookie.name,
          storeId: cookie.storeId
        });
        console.log(`[Tab Cleanser] Deleted cookie: ${cookie.name} from ${cookie.domain}`);
      } catch (error) {
        console.error(`[Tab Cleanser] Error deleting cookie ${cookie.name} from ${cookie.domain}:`, error);
      }
    });
    
    // Wait for all deletions to complete
    await Promise.all(deletePromises);
    console.log('[Tab Cleanser] All cookies deletion completed');
    
  } catch (error) {
    console.error('[Tab Cleanser] Error in deleteAllCookies:', error);
    throw error;
  }
}

/**
 * Show a simple notification to the user
 */
function showNotification(message, type = 'info') {
  // Create notification using Chrome's notification API
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Tab Cleanser',
    message: message
  });
}

// Log when service worker starts
console.log('[Tab Cleanser] Background service worker started'); 