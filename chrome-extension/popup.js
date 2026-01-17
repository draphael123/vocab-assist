document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const quickWords = document.getElementById('quick-words');
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
  
  function showResults(word) {
    const synonyms = getSynonyms(word);
    
    quickWords.style.display = 'none';
    results.classList.add('show');
    resultWord.textContent = `"${word}"`;
    
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
      setTimeout(() => {
        copiedToast.classList.remove('show');
      }, 1500);
    });
  }
});

