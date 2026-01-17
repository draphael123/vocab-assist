// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'upgrade-word',
    title: 'Upgrade Word',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'upgrade-word' && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'showSuggestions',
      word: info.selectionText.trim()
    });
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'upgrade-word') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'triggerUpgrade'
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSynonyms') {
    // Import vocabulary data
    importScripts('vocabulary.js');
    const synonyms = getSynonyms(request.word);
    sendResponse({ synonyms });
  }
  return true;
});

