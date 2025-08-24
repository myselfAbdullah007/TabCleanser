// Popup JavaScript for Cookie Cleaner extension
// Handles UI interactions and settings management

// DOM elements
const autoCleanerToggle = document.getElementById('autoCleanerToggle');
const cleanNowBtn = document.getElementById('cleanNowBtn');
const domainInput = document.getElementById('domainInput');
const addDomainBtn = document.getElementById('addDomainBtn');
const whitelistItems = document.getElementById('whitelistItems');
const emptyWhitelist = document.getElementById('emptyWhitelist');
const statusMessage = document.getElementById('statusMessage');

// Current settings
let currentSettings = {
  enabled: true,
  whitelist: []
};

/**
 * Show status message
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, info)
 */
function showStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
  }, 3000);
}

/**
 * Load settings from storage
 */
async function loadSettings() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
    currentSettings = response;
    
    // Update UI
    autoCleanerToggle.checked = currentSettings.enabled;
    updateWhitelistDisplay();
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus('Error loading settings', 'error');
  }
}

/**
 * Save settings to storage
 */
async function saveSettings() {
  try {
    await chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: currentSettings
    });
    showStatus('Settings saved successfully', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Error saving settings', 'error');
  }
}

/**
 * Update the whitelist display
 */
function updateWhitelistDisplay() {
  if (currentSettings.whitelist.length === 0) {
    whitelistItems.style.display = 'none';
    emptyWhitelist.style.display = 'block';
  } else {
    whitelistItems.style.display = 'block';
    emptyWhitelist.style.display = 'none';
    
    // Clear existing items
    whitelistItems.innerHTML = '';
    
    // Add each whitelisted domain
    currentSettings.whitelist.forEach(domain => {
      const item = createWhitelistItem(domain);
      whitelistItems.appendChild(item);
    });
  }
}

/**
 * Create a whitelist item element
 * @param {string} domain - The domain name
 * @returns {HTMLElement} The whitelist item element
 */
function createWhitelistItem(domain) {
  const item = document.createElement('div');
  item.className = 'whitelist-item';
  
  const domainText = document.createElement('span');
  domainText.className = 'domain-text';
  domainText.textContent = domain;
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.innerHTML = '×';
  removeBtn.title = 'Remove from whitelist';
  
  removeBtn.addEventListener('click', () => {
    removeFromWhitelist(domain);
  });
  
  item.appendChild(domainText);
  item.appendChild(removeBtn);
  
  return item;
}

/**
 * Add domain to whitelist
 * @param {string} domain - The domain to add
 */
function addToWhitelist(domain) {
  // Normalize domain
  const normalizedDomain = domain.toLowerCase().trim();
  
  // Validate domain
  if (!isValidDomain(normalizedDomain)) {
    showStatus('Please enter a valid domain name', 'error');
    return;
  }
  
  // Check if already in whitelist
  if (currentSettings.whitelist.includes(normalizedDomain)) {
    showStatus('Domain is already in whitelist', 'error');
    return;
  }
  
  // Add to whitelist
  currentSettings.whitelist.push(normalizedDomain);
  saveSettings();
  updateWhitelistDisplay();
  
  // Clear input
  domainInput.value = '';
  
  showStatus(`Added ${normalizedDomain} to whitelist`, 'success');
}

/**
 * Remove domain from whitelist
 * @param {string} domain - The domain to remove
 */
function removeFromWhitelist(domain) {
  const index = currentSettings.whitelist.indexOf(domain);
  if (index > -1) {
    currentSettings.whitelist.splice(index, 1);
    saveSettings();
    updateWhitelistDisplay();
    showStatus(`Removed ${domain} from whitelist`, 'success');
  }
}

/**
 * Validate domain name
 * @param {string} domain - The domain to validate
 * @returns {boolean} True if valid domain
 */
function isValidDomain(domain) {
  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain) && domain.length > 0 && domain.length <= 253;
}

/**
 * Clean current tab data
 */
async function cleanCurrentTab() {
  try {
    cleanNowBtn.disabled = true;
    cleanNowBtn.textContent = 'Cleaning...';
    
    const response = await chrome.runtime.sendMessage({ action: 'cleanCurrentTab' });
    
    if (response.success) {
      showStatus(`Cleaned data for ${response.domain}`, 'success');
    } else {
      showStatus(response.error || 'Error cleaning current tab', 'error');
    }
  } catch (error) {
    console.error('Error cleaning current tab:', error);
    showStatus('Error cleaning current tab', 'error');
  } finally {
    cleanNowBtn.disabled = false;
    cleanNowBtn.innerHTML = '<span class="btn-icon">🧹</span>Clean Current Tab';
  }
}

// Event Listeners

// Auto cleaner toggle
autoCleanerToggle.addEventListener('change', () => {
  currentSettings.enabled = autoCleanerToggle.checked;
  saveSettings();
});

// Clean now button
cleanNowBtn.addEventListener('click', cleanCurrentTab);

// Add domain button
addDomainBtn.addEventListener('click', () => {
  const domain = domainInput.value;
  if (domain.trim()) {
    addToWhitelist(domain);
  }
});

// Enter key in domain input
domainInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const domain = domainInput.value;
    if (domain.trim()) {
      addToWhitelist(domain);
    }
  }
});

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
});

// Handle window focus to refresh settings
window.addEventListener('focus', () => {
  loadSettings();
}); 