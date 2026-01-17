import vocabularyData from '../../../shared/vocabulary.json';
import { Word, VocabularyData } from './types';

const data = vocabularyData as VocabularyData;

export function getAllWords(): Word[] {
  return data.words;
}

export function getWordById(id: string): Word | undefined {
  return data.words.find(w => w.id === id);
}

export function getWordsByLevel(level: Word['level']): Word[] {
  return data.words.filter(w => w.level === level);
}

export function getWordsByCategory(category: Word['category']): Word[] {
  return data.words.filter(w => w.category === category);
}

export function searchWords(query: string): Word[] {
  const lowercaseQuery = query.toLowerCase();
  return data.words.filter(w => 
    w.word.toLowerCase().includes(lowercaseQuery) ||
    w.definition.toLowerCase().includes(lowercaseQuery) ||
    w.synonyms.some(s => s.toLowerCase().includes(lowercaseQuery))
  );
}

export function getWordOfTheDay(): Word {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % data.words.length;
  return data.words[index];
}

export function getRandomWords(count: number, exclude?: string[]): Word[] {
  const available = exclude 
    ? data.words.filter(w => !exclude.includes(w.id))
    : data.words;
  
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getSynonymsForCommonWord(word: string): string[] {
  const lowercaseWord = word.toLowerCase();
  return data.synonymMap[lowercaseWord] || [];
}

export function getLevelColor(level: Word['level']): string {
  switch (level) {
    case 'beginner': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'expert': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
  }
}

export function getCategoryIcon(category: Word['category']): string {
  switch (category) {
    case 'general': return '📚';
    case 'technical': return '💻';
    case 'business': return '💼';
    case 'academic': return '🎓';
  }
}

