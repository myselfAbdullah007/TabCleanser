// Tab Cleanser - Content Script

// Listen for postMessage events from the page
window.addEventListener("message", function (event) {
  // Only accept messages from the same frame
  if (event.source != window) return;

  // Only accept messages that we know are ours
  if (event.data.type && (event.data.type === "CLEAR_COOKIES_EXTENSION_API")) {
    console.log('[Tab Cleanser] Received CLEAR_COOKIES_EXTENSION_API message');
    
    // Send message to background script to clear all cookies
    chrome.runtime.sendMessage({ type: "CLEAR_COOKIES_EXTENSION_API" });
  }

  if (event.data.type && (event.data.type === "CLEAR_COOKIES_DOCUMENT")) {
    console.log('[Tab Cleanser] Received CLEAR_COOKIES_DOCUMENT message');
    
    // Clear cookies visible to JavaScript for current domain and super-domains
    clearCookiesVisibleToJavaScript();
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "COOKIES_CLEARED_VIA_EXTENSION_API") {
    console.log('[Tab Cleanser] Cookies cleared via extension API');
    
    // Show toast notification on the page
    showToast('All cookies cleared!', 'success');
    
    // Post message back to the page to notify that cookies have been cleared
    window.postMessage({ type: "COOKIES_CLEARED_VIA_EXTENSION_API" }, "*");
  }
});

/**
 * Clear cookies visible to JavaScript for the current domain and super-domains
 * Note: This does not delete cookies that have a path value as this is not possible using the document object
 */
function clearCookiesVisibleToJavaScript() {
  console.log('[Tab Cleanser] Clearing cookies visible to JavaScript');
  
  // Get all cookies for current domain
  const cookies = document.cookie.split(";");
  
  // Clear each cookie by setting it to expire in the past
  cookies.forEach(function (cookie) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    // Set cookie to expire in the past to delete it
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + window.location.hostname;
    
    // Also try with www subdomain
    if (window.location.hostname.indexOf("www.") === 0) {
      const domainWithoutWww = window.location.hostname.substring(4);
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + domainWithoutWww;
    } else {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=." + window.location.hostname;
    }
    
    console.log(`[Tab Cleanser] Cleared cookie: ${name}`);
  });
  
  console.log('[Tab Cleanser] Cookies visible to JavaScript cleared');
  
  // Show toast notification
  showToast('Cookies cleared for this domain!', 'success');
}

/**
 * Show a simple toast notification on the webpage
 */
function showToast(message, type = 'info') {
  // Remove existing toast if any
  const existingToast = document.getElementById('tab-cleanser-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'tab-cleanser-toast';
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }
  }, 3000);
}

// Log when content script loads
console.log('[Tab Cleanser] Content script loaded on:', window.location.href); 