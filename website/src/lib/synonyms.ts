import synonymsData from '../data/synonyms.json';

export type Tone = 'formal' | 'academic' | 'business' | 'casual';

interface SynonymData {
  words: Record<string, Record<Tone, string[]>>;
  phrases: Record<string, Record<Tone, string[]>>;
  weakWords: string[];
}

const data = synonymsData as SynonymData;

export function getSynonymsForWord(word: string, tone: Tone = 'formal'): string[] {
  const lowerWord = word.toLowerCase().trim();
  const wordData = data.words[lowerWord];
  
  if (wordData) {
    return wordData[tone] || wordData.formal || [];
  }
  
  return [];
}

export function getSynonymsForPhrase(phrase: string, tone: Tone = 'formal'): string[] {
  const lowerPhrase = phrase.toLowerCase().trim();
  const phraseData = data.phrases[lowerPhrase];
  
  if (phraseData) {
    return phraseData[tone] || phraseData.formal || [];
  }
  
  return [];
}

export function getAllSynonyms(word: string, tone: Tone = 'formal'): string[] {
  // Try as word first, then as phrase
  const wordSynonyms = getSynonymsForWord(word, tone);
  if (wordSynonyms.length > 0) return wordSynonyms;
  
  const phraseSynonyms = getSynonymsForPhrase(word, tone);
  return phraseSynonyms;
}

export function getWeakWords(): string[] {
  return data.weakWords;
}

export function findWeakWordsInText(text: string): { word: string; index: number; length: number }[] {
  const weakWords = getWeakWords();
  const found: { word: string; index: number; length: number }[] = [];
  const lowerText = text.toLowerCase();
  
  weakWords.forEach(weak => {
    const regex = new RegExp(`\\b${weak}\\b`, 'gi');
    let match;
    while ((match = regex.exec(lowerText)) !== null) {
      found.push({
        word: text.substring(match.index, match.index + weak.length),
        index: match.index,
        length: weak.length
      });
    }
  });
  
  // Sort by index
  found.sort((a, b) => a.index - b.index);
  return found;
}

export function calculateWritingScore(text: string): {
  score: number;
  weakWordCount: number;
  totalWords: number;
  suggestions: string[];
} {
  if (!text.trim()) {
    return { score: 100, weakWordCount: 0, totalWords: 0, suggestions: [] };
  }
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;
  const weakWordsFound = findWeakWordsInText(text);
  const weakWordCount = weakWordsFound.length;
  
  // Calculate score (100 - penalty for weak words)
  const weakWordPenalty = (weakWordCount / totalWords) * 100;
  const score = Math.max(0, Math.min(100, Math.round(100 - weakWordPenalty * 2)));
  
  // Generate suggestions
  const suggestions: string[] = [];
  const uniqueWeakWords = Array.from(new Set(weakWordsFound.map(w => w.word.toLowerCase())));
  
  uniqueWeakWords.slice(0, 5).forEach(word => {
    const synonyms = getSynonymsForWord(word, 'formal');
    if (synonyms.length > 0) {
      suggestions.push(`Replace "${word}" with "${synonyms[0]}" or "${synonyms[1]}"`);
    }
  });
  
  return { score, weakWordCount, totalWords, suggestions };
}

export function upgradeText(text: string, tone: Tone = 'formal'): string {
  let upgradedText = text;
  const weakWords = getWeakWords();
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedWeakWords = weakWords.slice().sort((a, b) => b.length - a.length);
  
  sortedWeakWords.forEach(weak => {
    const synonyms = getSynonymsForWord(weak, tone);
    if (synonyms.length > 0) {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      upgradedText = upgradedText.replace(regex, (match) => {
        // Preserve capitalization
        if (match[0] === match[0].toUpperCase()) {
          return synonyms[0].charAt(0).toUpperCase() + synonyms[0].slice(1);
        }
        return synonyms[0];
      });
    }
  });
  
  // Also replace phrases
  Object.keys(data.phrases).forEach(phrase => {
    const synonyms = getSynonymsForPhrase(phrase, tone);
    if (synonyms.length > 0) {
      const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      upgradedText = upgradedText.replace(regex, synonyms[0]);
    }
  });
  
  return upgradedText;
}

export function getAvailableWords(): string[] {
  return Object.keys(data.words);
}

export function getAvailablePhrases(): string[] {
  return Object.keys(data.phrases);
}

export const toneDescriptions: Record<Tone, string> = {
  formal: 'Professional and polished',
  academic: 'Scholarly and precise', 
  business: 'Corporate and strategic',
  casual: 'Friendly and conversational'
};
