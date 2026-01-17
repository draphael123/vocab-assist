// Enhanced synonym map with tone support
const synonymData = {
  words: {
    "good": { formal: ["excellent", "outstanding", "exceptional", "superior", "exemplary"], casual: ["great", "awesome", "fantastic", "terrific", "wonderful"] },
    "bad": { formal: ["poor", "inadequate", "substandard", "inferior", "deficient"], casual: ["terrible", "awful", "lousy", "crummy", "rough"] },
    "big": { formal: ["substantial", "considerable", "significant", "extensive", "sizable"], casual: ["huge", "massive", "enormous", "giant", "tremendous"] },
    "small": { formal: ["modest", "minimal", "limited", "minor", "slight"], casual: ["tiny", "little", "mini", "teeny", "slight"] },
    "important": { formal: ["crucial", "essential", "vital", "critical", "paramount"], casual: ["big deal", "major", "key", "crucial", "vital"] },
    "difficult": { formal: ["challenging", "demanding", "arduous", "formidable", "complex"], casual: ["tough", "hard", "tricky", "rough", "intense"] },
    "easy": { formal: ["straightforward", "uncomplicated", "manageable", "accessible", "attainable"], casual: ["simple", "breeze", "piece of cake", "no-brainer", "cinch"] },
    "fast": { formal: ["rapid", "swift", "expedient", "prompt", "accelerated"], casual: ["quick", "speedy", "snappy", "zippy", "lightning-fast"] },
    "slow": { formal: ["gradual", "deliberate", "measured", "unhurried", "leisurely"], casual: ["sluggish", "poky", "lazy", "dawdling", "unhurried"] },
    "use": { formal: ["utilize", "employ", "leverage", "implement", "apply"], casual: ["work with", "go with", "try", "pick", "grab"] },
    "make": { formal: ["create", "develop", "establish", "construct", "formulate"], casual: ["put together", "whip up", "come up with", "build", "craft"] },
    "change": { formal: ["modify", "alter", "adjust", "transform", "revise"], casual: ["switch up", "mix up", "tweak", "shake up", "flip"] },
    "fix": { formal: ["resolve", "rectify", "remedy", "address", "correct"], casual: ["sort out", "patch up", "work out", "deal with", "handle"] },
    "help": { formal: ["assist", "facilitate", "support", "aid", "enable"], casual: ["give a hand", "pitch in", "back up", "chip in", "lend support"] },
    "show": { formal: ["demonstrate", "illustrate", "reveal", "exhibit", "present"], casual: ["point out", "bring up", "lay out", "spell out", "break down"] },
    "get": { formal: ["obtain", "acquire", "secure", "procure", "attain"], casual: ["grab", "snag", "score", "pick up", "land"] },
    "think": { formal: ["consider", "contemplate", "evaluate", "assess", "deliberate"], casual: ["figure", "reckon", "guess", "suppose", "imagine"] },
    "say": { formal: ["state", "express", "articulate", "convey", "communicate"], casual: ["mention", "bring up", "point out", "note", "share"] },
    "very": { formal: ["exceptionally", "remarkably", "particularly", "extremely", "notably"], casual: ["super", "really", "totally", "seriously", "crazy"] },
    "many": { formal: ["numerous", "multiple", "various", "several", "abundant"], casual: ["tons of", "loads of", "bunch of", "heap of", "lots of"] },
    "really": { formal: ["genuinely", "truly", "indeed", "certainly", "undoubtedly"], casual: ["totally", "seriously", "honestly", "legit", "for real"] },
    "just": { formal: ["merely", "simply", "solely", "only", "precisely"], casual: ["only", "like", "kinda", "sorta", "barely"] },
    "basically": { formal: ["fundamentally", "essentially", "primarily", "principally", "chiefly"], casual: ["pretty much", "more or less", "kind of", "sort of", "like"] },
    "actually": { formal: ["in fact", "indeed", "in reality", "in truth", "genuinely"], casual: ["tbh", "for real", "no joke", "straight up", "low-key"] },
    "new": { formal: ["novel", "innovative", "contemporary", "modern", "recent"], casual: ["fresh", "latest", "brand-new", "hot", "up-and-coming"] },
    "old": { formal: ["established", "traditional", "longstanding", "legacy", "previous"], casual: ["dated", "vintage", "classic", "ancient", "outdated"] },
    "problem": { formal: ["issue", "challenge", "difficulty", "complication", "obstacle"], casual: ["snag", "hiccup", "headache", "hassle", "mess"] },
    "thing": { formal: ["matter", "element", "aspect", "factor", "component"], casual: ["stuff", "deal", "bit", "piece", "whatever"] },
    "nice": { formal: ["pleasant", "agreeable", "delightful", "commendable", "favorable"], casual: ["cool", "great", "awesome", "sweet", "solid"] },
    "interesting": { formal: ["compelling", "intriguing", "noteworthy", "fascinating", "engaging"], casual: ["cool", "neat", "wild", "sick", "dope"] },
    "amazing": { formal: ["remarkable", "extraordinary", "exceptional", "outstanding", "impressive"], casual: ["awesome", "incredible", "mind-blowing", "insane", "unreal"] },
    "different": { formal: ["distinct", "diverse", "varied", "alternative", "dissimilar"], casual: ["other", "another", "fresh", "unique", "unlike"] },
    "great": { formal: ["exceptional", "remarkable", "outstanding", "excellent", "superb"], casual: ["awesome", "amazing", "fantastic", "incredible", "sick"] }
  },
  weakWords: ["very", "really", "just", "actually", "basically", "literally", "definitely", "certainly", "obviously", "clearly", "simply", "quite", "rather", "fairly", "pretty", "somewhat", "kind of", "sort of", "a lot", "thing", "stuff", "good", "bad", "nice", "interesting", "amazing", "great", "big", "small"]
};

// State
let popup = null;
let floatingButton = null;
let activeElement = null;
let selectedText = '';
let selectionRange = null;
let lastReplacement = null;
let settings = {
  autoHighlight: true,
  tone: 'formal',
  showFloatingButton: true,
  spellCheck: true
};

// Stats tracking
let stats = {
  wordsUpgraded: 0,
  spellingFixed: 0,
  sessionsCount: 0,
  lastUsed: null
};

// Load settings and stats
chrome.storage.local.get(['vocabSettings', 'vocabStats'], (result) => {
  if (result.vocabSettings) settings = { ...settings, ...result.vocabSettings };
  if (result.vocabStats) stats = { ...stats, ...result.vocabStats };
});

// Get synonyms for a word
function getSynonyms(word, tone = 'formal') {
  const lowerWord = word.toLowerCase().trim();
  const wordData = synonymData.words[lowerWord];
  if (wordData) {
    return wordData[tone] || wordData.formal || [];
  }
  return [];
}

// Check if word is weak
function isWeakWord(word) {
  return synonymData.weakWords.includes(word.toLowerCase().trim());
}

// Create popup element
function createPopup() {
  if (popup) return popup;
  
  popup = document.createElement('div');
  popup.id = 'vocab-assist-popup';
  popup.innerHTML = `
    <div class="vocab-assist-header">
      <span class="vocab-assist-title">✨ Word Helper</span>
      <div class="vocab-assist-header-actions">
        <select class="vocab-assist-tone-select" id="vocab-tone">
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
        </select>
        <button class="vocab-assist-close">&times;</button>
      </div>
    </div>
    <div class="vocab-assist-mode" id="vocab-mode">
      <button class="vocab-mode-btn active" data-mode="upgrade">✨ Upgrade</button>
      <button class="vocab-mode-btn" data-mode="spell">📝 Spelling</button>
    </div>
    <div class="vocab-assist-word"></div>
    <div class="vocab-assist-suggestions"></div>
    <div class="vocab-assist-actions">
      <button class="vocab-assist-undo" id="vocab-undo" style="display: none;">
        ↩ Undo
      </button>
    </div>
    <div class="vocab-assist-footer">
      <span class="vocab-assist-stats">📊 <span id="vocab-stats-count">0</span> improved</span>
      <a href="https://website-ten-navy-tv0whkwmm8.vercel.app" target="_blank">More →</a>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Close button handler
  popup.querySelector('.vocab-assist-close').addEventListener('click', hidePopup);
  
  // Tone selector
  popup.querySelector('#vocab-tone').addEventListener('change', (e) => {
    settings.tone = e.target.value;
    chrome.storage.local.set({ vocabSettings: settings });
    if (selectedText && currentMode === 'upgrade') {
      updateSuggestions(selectedText, 'upgrade');
    }
  });
  
  // Mode buttons
  popup.querySelectorAll('.vocab-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      popup.querySelectorAll('.vocab-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      if (selectedText) {
        updateSuggestions(selectedText, currentMode);
      }
    });
  });
  
  // Undo button
  popup.querySelector('#vocab-undo').addEventListener('click', undoLastReplacement);
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (popup && !popup.contains(e.target) && !floatingButton?.contains(e.target)) {
      hidePopup();
    }
  });
  
  return popup;
}

let currentMode = 'upgrade';

// Create floating button
function createFloatingButton() {
  if (floatingButton) return floatingButton;
  
  floatingButton = document.createElement('div');
  floatingButton.id = 'vocab-assist-float-btn';
  floatingButton.style.display = 'none';
  
  floatingButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (selectedText) {
      const rect = floatingButton.getBoundingClientRect();
      showPopup(selectedText, rect.left + window.scrollX, rect.bottom + window.scrollY + 5);
    }
  });
  
  document.body.appendChild(floatingButton);
  return floatingButton;
}

// Update floating button appearance based on word type
function updateFloatingButton(word, x, y) {
  if (!settings.showFloatingButton) return;
  
  createFloatingButton();
  
  const hasUpgrade = getSynonyms(word, settings.tone).length > 0;
  const hasSpelling = window.VocabSpellCheck && !window.VocabSpellCheck.isCorrectlySpelled(word);
  
  if (!hasUpgrade && !hasSpelling) {
    floatingButton.style.display = 'none';
    return;
  }
  
  // Show different icon based on what's available
  if (hasSpelling) {
    floatingButton.innerHTML = '📝';
    floatingButton.title = 'Fix spelling';
    floatingButton.className = 'vocab-float-spelling';
    currentMode = 'spell';
  } else {
    floatingButton.innerHTML = '✨';
    floatingButton.title = 'Upgrade word';
    floatingButton.className = '';
    currentMode = 'upgrade';
  }
  
  floatingButton.id = 'vocab-assist-float-btn';
  floatingButton.style.display = 'flex';
  floatingButton.style.left = `${x}px`;
  floatingButton.style.top = `${y - 35}px`;
}

// Hide floating button
function hideFloatingButton() {
  if (floatingButton) {
    floatingButton.style.display = 'none';
  }
}

// Update suggestions in popup
function updateSuggestions(word, mode = 'upgrade') {
  const suggestionsContainer = popup.querySelector('.vocab-assist-suggestions');
  const wordDisplay = popup.querySelector('.vocab-assist-word');
  suggestionsContainer.innerHTML = '';
  
  let suggestions = [];
  
  if (mode === 'upgrade') {
    suggestions = getSynonyms(word, settings.tone);
    wordDisplay.innerHTML = `Upgrade "<strong>${word}</strong>"`;
  } else if (mode === 'spell' && window.VocabSpellCheck) {
    suggestions = window.VocabSpellCheck.getSpellingSuggestions(word);
    wordDisplay.innerHTML = `<span class="spelling-error">Spelling: "<strong>${word}</strong>"</span>`;
  }
  
  if (suggestions.length > 0) {
    suggestions.slice(0, 8).forEach(suggestion => {
      const btn = document.createElement('button');
      btn.className = 'vocab-assist-suggestion';
      if (mode === 'spell') btn.classList.add('spelling-suggestion');
      btn.textContent = suggestion;
      btn.addEventListener('click', () => replaceWord(suggestion, mode));
      suggestionsContainer.appendChild(btn);
    });
  } else {
    const noResultsText = mode === 'upgrade' 
      ? 'No upgrades available' 
      : 'No spelling suggestions';
    suggestionsContainer.innerHTML = `<div class="vocab-assist-no-results">${noResultsText}</div>`;
  }
  
  // Update mode buttons
  popup.querySelectorAll('.vocab-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
}

// Show popup with suggestions
function showPopup(word, x, y) {
  createPopup();
  hideFloatingButton();
  
  // Determine which mode to show
  const hasUpgrade = getSynonyms(word, settings.tone).length > 0;
  const hasSpelling = window.VocabSpellCheck && !window.VocabSpellCheck.isCorrectlySpelled(word);
  
  if (hasSpelling && !hasUpgrade) {
    currentMode = 'spell';
  } else if (hasUpgrade) {
    currentMode = 'upgrade';
  }
  
  popup.querySelector('#vocab-tone').value = settings.tone;
  popup.querySelector('#vocab-stats-count').textContent = stats.wordsUpgraded + stats.spellingFixed;
  
  // Show/hide undo button
  const undoBtn = popup.querySelector('#vocab-undo');
  undoBtn.style.display = lastReplacement ? 'block' : 'none';
  
  // Show/hide mode buttons based on availability
  const modeContainer = popup.querySelector('#vocab-mode');
  const upgradeBtn = modeContainer.querySelector('[data-mode="upgrade"]');
  const spellBtn = modeContainer.querySelector('[data-mode="spell"]');
  
  upgradeBtn.style.display = hasUpgrade ? 'block' : 'none';
  spellBtn.style.display = hasSpelling ? 'block' : 'none';
  modeContainer.style.display = (hasUpgrade && hasSpelling) ? 'flex' : 'none';
  
  updateSuggestions(word, currentMode);
  
  // Position popup
  popup.style.display = 'block';
  
  const popupRect = popup.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let left = x;
  let top = y + 10;
  
  if (left + popupRect.width > viewportWidth - 20) {
    left = viewportWidth - popupRect.width - 20;
  }
  
  if (top + popupRect.height > viewportHeight - 20) {
    top = y - popupRect.height - 10;
  }
  
  popup.style.left = `${Math.max(10, left)}px`;
  popup.style.top = `${Math.max(10, top)}px`;
}

// Hide popup
function hidePopup() {
  if (popup) {
    popup.style.display = 'none';
  }
  hideFloatingButton();
}

// Replace selected word
function replaceWord(newWord, mode = 'upgrade') {
  if (!activeElement || !selectedText) {
    hidePopup();
    return;
  }
  
  // Store for undo
  lastReplacement = {
    element: activeElement,
    original: selectedText,
    replacement: newWord,
    selectionStart: null,
    selectionEnd: null,
    mode: mode
  };
  
  if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const text = activeElement.value;
    
    lastReplacement.selectionStart = start;
    lastReplacement.selectionEnd = end;
    lastReplacement.originalValue = text;
    
    activeElement.value = text.substring(0, start) + newWord + text.substring(end);
    activeElement.selectionStart = activeElement.selectionEnd = start + newWord.length;
    activeElement.focus();
    
    // Trigger input event
    activeElement.dispatchEvent(new Event('input', { bubbles: true }));
  } else if (activeElement.isContentEditable && selectionRange) {
    lastReplacement.range = selectionRange.cloneRange();
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(selectionRange);
    document.execCommand('insertText', false, newWord);
  }
  
  // Update stats
  if (mode === 'spell') {
    stats.spellingFixed++;
  } else {
    stats.wordsUpgraded++;
  }
  stats.lastUsed = new Date().toISOString();
  chrome.storage.local.set({ vocabStats: stats });
  
  hidePopup();
  
  const emoji = mode === 'spell' ? '📝' : '✨';
  showToast(`${emoji} "${selectedText}" → "${newWord}"`);
}

// Undo last replacement
function undoLastReplacement() {
  if (!lastReplacement) return;
  
  const { element, original, originalValue, selectionStart, range, mode } = lastReplacement;
  
  if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
    element.value = originalValue;
    element.selectionStart = element.selectionEnd = selectionStart + original.length;
    element.focus();
    element.dispatchEvent(new Event('input', { bubbles: true }));
  } else if (element.isContentEditable && range) {
    document.execCommand('undo');
  }
  
  if (mode === 'spell') {
    stats.spellingFixed = Math.max(0, stats.spellingFixed - 1);
  } else {
    stats.wordsUpgraded = Math.max(0, stats.wordsUpgraded - 1);
  }
  chrome.storage.local.set({ vocabStats: stats });
  
  showToast(`↩ Undid replacement`);
  lastReplacement = null;
  hidePopup();
}

// Show toast notification
function showToast(message) {
  const existing = document.querySelector('.vocab-assist-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'vocab-assist-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Handle text selection
document.addEventListener('mouseup', (e) => {
  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && text.length > 0 && !text.includes(' ') && text.length < 30) {
      selectedText = text;
      activeElement = document.activeElement;
      
      if (selection.rangeCount > 0) {
        selectionRange = selection.getRangeAt(0).cloneRange();
      }
      
      // Check for upgrades or spelling errors
      const hasUpgrade = getSynonyms(text, settings.tone).length > 0;
      const hasSpelling = settings.spellCheck && window.VocabSpellCheck && !window.VocabSpellCheck.isCorrectlySpelled(text);
      
      if (hasUpgrade || hasSpelling) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        updateFloatingButton(text, rect.left + window.scrollX + (rect.width / 2) - 15, rect.top + window.scrollY);
      } else {
        hideFloatingButton();
      }
    } else {
      hideFloatingButton();
    }
  }, 10);
});

// Handle keyboard shortcut (Ctrl/Cmd + Shift + U)
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'u') {
    e.preventDefault();
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && !text.includes(' ')) {
      selectedText = text;
      activeElement = document.activeElement;
      
      if (selection.rangeCount > 0) {
        selectionRange = selection.getRangeAt(0).cloneRange();
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        showPopup(text, rect.left + window.scrollX, rect.bottom + window.scrollY);
      }
    }
  }
  
  // Escape to close
  if (e.key === 'Escape') {
    hidePopup();
  }
  
  // Ctrl/Cmd + Z to undo (when popup is open)
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && popup?.style.display === 'block') {
    if (lastReplacement) {
      e.preventDefault();
      undoLastReplacement();
    }
  }
});

// Listen for messages from background/popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showSuggestions') {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      selectedText = request.word;
      activeElement = document.activeElement;
      selectionRange = selection.getRangeAt(0).cloneRange();
      showPopup(request.word, rect.left + window.scrollX, rect.bottom + window.scrollY);
    }
  }
  
  if (request.action === 'triggerUpgrade') {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && !text.includes(' ')) {
      selectedText = text;
      activeElement = document.activeElement;
      
      if (selection.rangeCount > 0) {
        selectionRange = selection.getRangeAt(0).cloneRange();
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        showPopup(text, rect.left + window.scrollX, rect.bottom + window.scrollY);
      }
    }
  }
  
  if (request.action === 'updateSettings') {
    settings = { ...settings, ...request.settings };
  }
  
  if (request.action === 'getStats') {
    sendResponse({ stats });
  }
});

// Initialize
createFloatingButton();
