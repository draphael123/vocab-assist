import * as path from 'path';
import * as fs from 'fs';

export interface Word {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'general' | 'technical' | 'business' | 'academic';
}

export interface VocabularyData {
  words: Word[];
  synonymMap: Record<string, string[]>;
}

let vocabularyData: VocabularyData | null = null;

export function loadVocabulary(extensionPath: string): VocabularyData {
  if (vocabularyData) {
    return vocabularyData;
  }

  const vocabPath = path.join(extensionPath, '..', 'shared', 'vocabulary.json');
  
  try {
    const content = fs.readFileSync(vocabPath, 'utf-8');
    vocabularyData = JSON.parse(content);
    return vocabularyData!;
  } catch (error) {
    console.error('Failed to load vocabulary:', error);
    // Return empty data as fallback
    return { words: [], synonymMap: {} };
  }
}

export function getAllWords(extensionPath: string): Word[] {
  const data = loadVocabulary(extensionPath);
  return data.words;
}

export function getWordById(extensionPath: string, id: string): Word | undefined {
  const data = loadVocabulary(extensionPath);
  return data.words.find(w => w.id === id);
}

export function searchWords(extensionPath: string, query: string): Word[] {
  const data = loadVocabulary(extensionPath);
  const lowercaseQuery = query.toLowerCase();
  
  return data.words.filter(w =>
    w.word.toLowerCase().includes(lowercaseQuery) ||
    w.definition.toLowerCase().includes(lowercaseQuery) ||
    w.synonyms.some(s => s.toLowerCase().includes(lowercaseQuery))
  );
}

export function getWordOfTheDay(extensionPath: string): Word | undefined {
  const data = loadVocabulary(extensionPath);
  if (data.words.length === 0) return undefined;
  
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % data.words.length;
  return data.words[index];
}

export function getRandomWords(extensionPath: string, count: number, exclude?: string[]): Word[] {
  const data = loadVocabulary(extensionPath);
  const available = exclude
    ? data.words.filter(w => !exclude.includes(w.id))
    : data.words;

  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getSynonymsForCommonWord(extensionPath: string, word: string): string[] {
  const data = loadVocabulary(extensionPath);
  const lowercaseWord = word.toLowerCase();
  return data.synonymMap[lowercaseWord] || [];
}

export function findWordExact(extensionPath: string, word: string): Word | undefined {
  const data = loadVocabulary(extensionPath);
  return data.words.find(w => w.word.toLowerCase() === word.toLowerCase());
}

export function getSynonymsForWord(extensionPath: string, word: string): string[] {
  const data = loadVocabulary(extensionPath);
  
  // First check the synonym map for common words
  const commonSynonyms = data.synonymMap[word.toLowerCase()];
  if (commonSynonyms && commonSynonyms.length > 0) {
    return commonSynonyms;
  }
  
  // Then check if it's a vocabulary word
  const vocabWord = data.words.find(w => w.word.toLowerCase() === word.toLowerCase());
  if (vocabWord) {
    return vocabWord.synonyms;
  }
  
  return [];
}

export function getLevelEmoji(level: Word['level']): string {
  switch (level) {
    case 'beginner': return '🟢';
    case 'intermediate': return '🔵';
    case 'advanced': return '🟣';
    case 'expert': return '🔴';
  }
}

export function getCategoryEmoji(category: Word['category']): string {
  switch (category) {
    case 'general': return '📚';
    case 'technical': return '💻';
    case 'business': return '💼';
    case 'academic': return '🎓';
  }
}

