// Synonym data
const synonymData = {
  words: {
    "good": { formal: ["excellent", "outstanding", "exceptional", "superior", "exemplary"], casual: ["great", "awesome", "fantastic", "terrific", "wonderful"] },
    "bad": { formal: ["poor", "inadequate", "substandard", "inferior", "deficient"], casual: ["terrible", "awful", "lousy", "crummy", "rough"] },
    "big": { formal: ["substantial", "considerable", "significant", "extensive", "sizable"], casual: ["huge", "massive", "enormous", "giant", "tremendous"] },
    "small": { formal: ["modest", "minimal", "limited", "minor", "slight"], casual: ["tiny", "little", "mini", "teeny", "slight"] },
    "important": { formal: ["crucial", "essential", "vital", "critical", "paramount"], casual: ["major", "key", "crucial", "vital", "big deal"] },
    "difficult": { formal: ["challenging", "demanding", "arduous", "formidable", "complex"], casual: ["tough", "hard", "tricky", "rough", "intense"] },
    "easy": { formal: ["straightforward", "uncomplicated", "manageable", "accessible"], casual: ["simple", "breeze", "piece of cake", "no-brainer"] },
    "fast": { formal: ["rapid", "swift", "expedient", "prompt", "accelerated"], casual: ["quick", "speedy", "snappy", "zippy"] },
    "slow": { formal: ["gradual", "deliberate", "measured", "unhurried"], casual: ["sluggish", "poky", "lazy", "dawdling"] },
    "use": { formal: ["utilize", "employ", "leverage", "implement", "apply"], casual: ["work with", "go with", "try", "grab"] },
    "make": { formal: ["create", "develop", "establish", "construct", "formulate"], casual: ["put together", "whip up", "come up with", "build"] },
    "change": { formal: ["modify", "alter", "adjust", "transform", "revise"], casual: ["switch up", "mix up", "tweak", "shake up"] },
    "help": { formal: ["assist", "facilitate", "support", "aid", "enable"], casual: ["give a hand", "pitch in", "back up", "chip in"] },
    "show": { formal: ["demonstrate", "illustrate", "reveal", "exhibit", "present"], casual: ["point out", "bring up", "lay out", "spell out"] },
    "get": { formal: ["obtain", "acquire", "secure", "procure", "attain"], casual: ["grab", "snag", "score", "pick up", "land"] },
    "think": { formal: ["consider", "contemplate", "evaluate", "assess", "deliberate"], casual: ["figure", "reckon", "guess", "suppose"] },
    "very": { formal: ["exceptionally", "remarkably", "particularly", "extremely"], casual: ["super", "really", "totally", "seriously"] },
    "many": { formal: ["numerous", "multiple", "various", "several", "abundant"], casual: ["tons of", "loads of", "bunch of", "lots of"] },
    "really": { formal: ["genuinely", "truly", "indeed", "certainly"], casual: ["totally", "seriously", "honestly", "legit"] },
    "nice": { formal: ["pleasant", "agreeable", "delightful", "commendable"], casual: ["cool", "great", "awesome", "sweet"] },
    "interesting": { formal: ["compelling", "intriguing", "noteworthy", "fascinating"], casual: ["cool", "neat", "wild", "dope"] },
    "amazing": { formal: ["remarkable", "extraordinary", "exceptional", "outstanding"], casual: ["awesome", "incredible", "mind-blowing", "insane"] },
    "different": { formal: ["distinct", "diverse", "varied", "alternative"], casual: ["other", "another", "fresh", "unique"] },
    "great": { formal: ["exceptional", "remarkable", "outstanding", "excellent"], casual: ["awesome", "amazing", "fantastic", "incredible"] },
    "problem": { formal: ["issue", "challenge", "difficulty", "obstacle"], casual: ["snag", "hiccup", "headache", "hassle"] },
    "thing": { formal: ["matter", "element", "aspect", "factor"], casual: ["stuff", "deal", "bit", "piece"] },
    "new": { formal: ["novel", "innovative", "contemporary", "modern"], casual: ["fresh", "latest", "brand-new", "hot"] },
    "old": { formal: ["established", "traditional", "longstanding", "legacy"], casual: ["dated", "vintage", "classic", "ancient"] }
  }
};

let currentTone = 'formal';
let settings = { showFloatingButton: true, autoHighlight: true };
let stats = { wordsUpgraded: 0, sessionsCount: 0 };

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load settings and stats
  chrome.storage.local.get(['vocabSettings', 'vocabStats'], (result) => {
    if (result.vocabSettings) {
      settings = { ...settings, ...result.vocabSettings };
      document.getElementById('setting-float').checked = settings.showFloatingButton;
      document.getElementById('setting-highlight').checked = settings.autoHighlight;
      currentTone = settings.tone || 'formal';
      updateToneButtons();
    }
    if (result.vocabStats) {
      stats = { ...stats, ...result.vocabStats };
      document.getElementById('words-upgraded').textContent = stats.wordsUpgraded;
      document.getElementById('session-count').textContent = stats.sessionsCount;
    }
  });
  
  // Increment session count
  stats.sessionsCount++;
  chrome.storage.local.set({ vocabStats: stats });
  
  const searchInput = document.getElementById('search');
  const quickWords = document.querySelector('.quick-words');
  const results = document.getElementById('results');
  const resultWord = document.getElementById('result-word');
  const synonymsContainer = document.getElementById('synonyms');
  const noResults = document.getElementById('no-results');
  const copiedToast = document.getElementById('copied');
  
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const word = e.target.value.trim().toLowerCase();
    if (word.length > 0) {
      showResults(word);
    } else {
      hideResults();
    }
  });
  
  // Quick word tags
  document.querySelectorAll('.word-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const word = tag.dataset.word;
      searchInput.value = word;
      showResults(word);
    });
  });
  
  // Tone buttons
  document.querySelectorAll('.tone-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTone = btn.dataset.tone;
      settings.tone = currentTone;
      chrome.storage.local.set({ vocabSettings: settings });
      updateToneButtons();
      
      // Update results if showing
      const word = searchInput.value.trim().toLowerCase();
      if (word) showResults(word);
      
      // Notify content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'updateSettings', settings });
        }
      });
    });
  });
  
  // Settings toggles
  document.getElementById('setting-float').addEventListener('change', (e) => {
    settings.showFloatingButton = e.target.checked;
    saveSettings();
  });
  
  document.getElementById('setting-highlight').addEventListener('change', (e) => {
    settings.autoHighlight = e.target.checked;
    saveSettings();
  });
  
  function updateToneButtons() {
    document.querySelectorAll('.tone-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tone === currentTone);
    });
  }
  
  function saveSettings() {
    chrome.storage.local.set({ vocabSettings: settings });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateSettings', settings });
      }
    });
  }
  
  function getSynonyms(word) {
    const wordData = synonymData.words[word];
    if (wordData) {
      return wordData[currentTone] || wordData.formal || [];
    }
    return [];
  }
  
  function showResults(word) {
    const synonyms = getSynonyms(word);
    
    quickWords.style.display = 'none';
    results.classList.add('show');
    resultWord.textContent = `"${word}" (${currentTone})`;
    
    if (synonyms.length > 0) {
      noResults.style.display = 'none';
      synonymsContainer.style.display = 'flex';
      synonymsContainer.innerHTML = '';
      
      synonyms.forEach(syn => {
        const btn = document.createElement('button');
        btn.className = 'synonym';
        btn.textContent = syn;
        btn.addEventListener('click', () => copyToClipboard(syn));
        synonymsContainer.appendChild(btn);
      });
    } else {
      synonymsContainer.style.display = 'none';
      noResults.style.display = 'block';
    }
  }
  
  function hideResults() {
    quickWords.style.display = 'block';
    results.classList.remove('show');
  }
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      copiedToast.classList.add('show');
      setTimeout(() => copiedToast.classList.remove('show'), 1500);
    });
  }
});
