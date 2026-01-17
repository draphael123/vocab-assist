// Synonym map (inline for content script)
const synonymMap = {
  "big": ["substantial", "considerable", "significant", "extensive", "vast", "immense", "enormous", "sizable"],
  "small": ["minor", "modest", "diminutive", "compact", "minimal", "slight", "negligible", "trivial"],
  "good": ["excellent", "outstanding", "exceptional", "superior", "remarkable", "exemplary", "stellar", "superb"],
  "bad": ["poor", "substandard", "inadequate", "inferior", "deficient", "unsatisfactory", "problematic", "flawed"],
  "fast": ["rapid", "swift", "expedient", "prompt", "accelerated", "brisk", "efficient", "nimble"],
  "slow": ["gradual", "deliberate", "unhurried", "leisurely", "measured", "sluggish", "lethargic", "protracted"],
  "important": ["crucial", "essential", "vital", "critical", "significant", "paramount", "pivotal", "imperative"],
  "difficult": ["challenging", "complex", "demanding", "arduous", "formidable", "intricate", "rigorous", "taxing"],
  "easy": ["straightforward", "simple", "effortless", "uncomplicated", "manageable", "elementary", "accessible", "intuitive"],
  "use": ["utilize", "employ", "leverage", "harness", "apply", "implement", "adopt", "incorporate"],
  "make": ["create", "develop", "construct", "generate", "produce", "establish", "formulate", "devise"],
  "change": ["modify", "alter", "adjust", "transform", "revise", "adapt", "update", "refactor"],
  "fix": ["resolve", "address", "rectify", "remedy", "correct", "repair", "debug", "patch"],
  "help": ["assist", "facilitate", "support", "enable", "aid", "contribute to", "foster", "bolster"],
  "show": ["demonstrate", "illustrate", "display", "reveal", "exhibit", "present", "indicate", "convey"],
  "get": ["obtain", "acquire", "retrieve", "fetch", "procure", "secure", "access", "derive"],
  "think": ["consider", "contemplate", "evaluate", "assess", "analyze", "deliberate", "reflect on", "ponder"],
  "problem": ["issue", "challenge", "obstacle", "complication", "impediment", "concern", "difficulty", "setback"],
  "old": ["legacy", "outdated", "obsolete", "antiquated", "deprecated", "archaic", "dated", "previous"],
  "new": ["novel", "innovative", "contemporary", "modern", "fresh", "cutting-edge", "emerging", "recent"],
  "clear": ["evident", "apparent", "obvious", "unambiguous", "explicit", "transparent", "lucid", "distinct"],
  "very": ["exceptionally", "remarkably", "particularly", "extremely", "significantly", "considerably", "substantially", "notably"],
  "many": ["numerous", "multiple", "various", "several", "abundant", "myriad", "countless", "extensive"],
  "few": ["limited", "scarce", "sparse", "minimal", "handful of", "select", "rare", "occasional"],
  "start": ["initiate", "commence", "launch", "begin", "inaugurate", "kick off", "embark on", "trigger"],
  "end": ["conclude", "terminate", "finalize", "complete", "cease", "finish", "wrap up", "culminate"],
  "need": ["require", "necessitate", "demand", "call for", "warrant", "entail", "depend on", "rely on"],
  "want": ["desire", "seek", "aim for", "aspire to", "prefer", "favor", "wish for", "intend"],
  "try": ["attempt", "endeavor", "strive", "aim", "seek to", "undertake", "experiment with", "test"],
  "work": ["function", "operate", "perform", "execute", "run", "serve", "collaborate", "contribute"],
  "look": ["examine", "inspect", "observe", "review", "scrutinize", "analyze", "survey", "assess"],
  "tell": ["inform", "notify", "communicate", "convey", "relay", "disclose", "report", "announce"],
  "ask": ["inquire", "request", "query", "seek", "solicit", "petition", "probe", "question"],
  "give": ["provide", "offer", "supply", "deliver", "present", "grant", "bestow", "confer"],
  "take": ["acquire", "obtain", "accept", "receive", "seize", "capture", "secure", "procure"],
  "see": ["observe", "perceive", "notice", "recognize", "identify", "discern", "detect", "witness"],
  "know": ["understand", "comprehend", "recognize", "realize", "appreciate", "grasp", "acknowledge", "be aware of"],
  "like": ["appreciate", "enjoy", "favor", "prefer", "admire", "value", "relish", "be fond of"],
  "find": ["discover", "locate", "identify", "uncover", "detect", "encounter", "ascertain", "determine"],
  "keep": ["maintain", "preserve", "retain", "sustain", "uphold", "continue", "persist", "safeguard"],
  "seem": ["appear", "look", "come across as", "give the impression", "suggest", "indicate", "imply", "convey"],
  "right": ["correct", "accurate", "appropriate", "proper", "suitable", "valid", "legitimate", "fitting"],
  "wrong": ["incorrect", "inaccurate", "erroneous", "mistaken", "flawed", "improper", "inappropriate", "faulty"],
  "different": ["distinct", "diverse", "varied", "alternative", "unique", "dissimilar", "divergent", "contrasting"],
  "great": ["exceptional", "remarkable", "outstanding", "excellent", "superb", "magnificent", "tremendous", "extraordinary"],
  "best": ["optimal", "ideal", "superior", "premier", "foremost", "preeminent", "paramount", "exemplary"],
  "really": ["genuinely", "truly", "actually", "indeed", "certainly", "undoubtedly", "absolutely", "definitely"],
  "however": ["nevertheless", "nonetheless", "yet", "still", "conversely", "on the other hand", "that said", "even so"],
  "but": ["however", "nevertheless", "yet", "although", "though", "whereas", "while", "despite this"],
  "because": ["since", "as", "due to", "owing to", "given that", "considering that", "in light of", "on account of"],
  "also": ["additionally", "furthermore", "moreover", "likewise", "similarly", "as well", "besides", "too"],
  "just": ["merely", "simply", "only", "solely", "precisely", "exactly", "recently", "barely"],
  "now": ["currently", "presently", "at present", "at this time", "immediately", "promptly", "today", "nowadays"]
};

let popup = null;
let activeElement = null;
let selectedText = '';
let selectionRange = null;

// Get synonyms for a word
function getSynonyms(word) {
  const lowerWord = word.toLowerCase().trim();
  return synonymMap[lowerWord] || [];
}

// Create popup element
function createPopup() {
  if (popup) return popup;
  
  popup = document.createElement('div');
  popup.id = 'vocab-assist-popup';
  popup.innerHTML = `
    <div class="vocab-assist-header">
      <span class="vocab-assist-title">✨ Upgrade Word</span>
      <button class="vocab-assist-close">&times;</button>
    </div>
    <div class="vocab-assist-word"></div>
    <div class="vocab-assist-suggestions"></div>
    <div class="vocab-assist-footer">
      Click to replace • <a href="https://website-ten-navy-tv0whkwmm8.vercel.app" target="_blank">More words →</a>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Close button handler
  popup.querySelector('.vocab-assist-close').addEventListener('click', hidePopup);
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (popup && !popup.contains(e.target)) {
      hidePopup();
    }
  });
  
  return popup;
}

// Show popup with suggestions
function showPopup(word, x, y) {
  const synonyms = getSynonyms(word);
  
  if (synonyms.length === 0) {
    return;
  }
  
  createPopup();
  
  popup.querySelector('.vocab-assist-word').textContent = `"${word}"`;
  
  const suggestionsContainer = popup.querySelector('.vocab-assist-suggestions');
  suggestionsContainer.innerHTML = '';
  
  synonyms.slice(0, 8).forEach(synonym => {
    const btn = document.createElement('button');
    btn.className = 'vocab-assist-suggestion';
    btn.textContent = synonym;
    btn.addEventListener('click', () => replaceWord(synonym));
    suggestionsContainer.appendChild(btn);
  });
  
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
}

// Replace selected word
function replaceWord(newWord) {
  if (!activeElement || !selectedText) {
    hidePopup();
    return;
  }
  
  if (activeElement.isContentEditable || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
    // For input/textarea elements
    if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const text = activeElement.value;
      activeElement.value = text.substring(0, start) + newWord + text.substring(end);
      activeElement.selectionStart = activeElement.selectionEnd = start + newWord.length;
      activeElement.focus();
      
      // Trigger input event for React/Vue apps
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    } 
    // For contenteditable elements
    else if (selectionRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(selectionRange);
      document.execCommand('insertText', false, newWord);
    }
  }
  
  hidePopup();
  
  // Show success toast
  showToast(`Replaced "${selectedText}" with "${newWord}"`);
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'vocab-assist-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Handle text selection
document.addEventListener('mouseup', (e) => {
  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && text.length > 0 && !text.includes(' ') && text.length < 30) {
      selectedText = text;
      activeElement = document.activeElement;
      
      // Save the selection range for later
      if (selection.rangeCount > 0) {
        selectionRange = selection.getRangeAt(0).cloneRange();
      }
      
      // Check if we have synonyms
      const synonyms = getSynonyms(text);
      if (synonyms.length > 0) {
        showPopup(text, e.pageX, e.pageY);
      }
    }
  }, 10);
});

// Handle keyboard shortcut
document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + Shift + U
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'u') {
    e.preventDefault();
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && !text.includes(' ')) {
      selectedText = text;
      activeElement = document.activeElement;
      
      if (selection.rangeCount > 0) {
        selectionRange = selection.getRangeAt(0).cloneRange();
      }
      
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      showPopup(text, rect.left + window.scrollX, rect.bottom + window.scrollY);
    }
  }
  
  // Escape to close
  if (e.key === 'Escape') {
    hidePopup();
  }
});

// Listen for messages from background script
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
});

