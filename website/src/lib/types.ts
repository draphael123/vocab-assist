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

export interface WordProgress {
  wordId: string;
  confidence: number; // 0-5
  timesReviewed: number;
  lastReviewed: string | null;
  nextReviewDate: string | null;
}

export interface UserProgress {
  words: Record<string, WordProgress>;
  quizHistory: QuizResult[];
  totalWordsLearned: number;
  currentStreak: number;
  lastStudyDate: string | null;
}

export interface QuizResult {
  date: string;
  score: number;
  totalQuestions: number;
  wordsTested: string[];
}

export interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}

