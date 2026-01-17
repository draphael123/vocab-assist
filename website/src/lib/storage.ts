import { UserProgress, WordProgress, QuizResult } from './types';

const STORAGE_KEY = 'vocabulary_progress';

function getDefaultProgress(): UserProgress {
  return {
    words: {},
    quizHistory: [],
    totalWordsLearned: 0,
    currentStreak: 0,
    lastStudyDate: null,
  };
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return getDefaultProgress();
  
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getWordProgress(wordId: string): WordProgress | null {
  const progress = getProgress();
  return progress.words[wordId] || null;
}

function calculateNextReviewDate(confidence: number): string {
  const now = new Date();
  let daysToAdd: number;
  
  switch (confidence) {
    case 0:
    case 1:
      daysToAdd = 1;
      break;
    case 2:
      daysToAdd = 2;
      break;
    case 3:
      daysToAdd = 4;
      break;
    case 4:
      daysToAdd = 7;
      break;
    case 5:
      daysToAdd = 14;
      break;
    default:
      daysToAdd = 1;
  }
  
  now.setDate(now.getDate() + daysToAdd);
  return now.toISOString();
}

export function updateWordConfidence(wordId: string, knew: boolean): void {
  const progress = getProgress();
  const existing = progress.words[wordId];
  
  let newConfidence: number;
  if (existing) {
    newConfidence = knew 
      ? Math.min(5, existing.confidence + 1)
      : Math.max(0, existing.confidence - 1);
  } else {
    newConfidence = knew ? 1 : 0;
  }
  
  progress.words[wordId] = {
    wordId,
    confidence: newConfidence,
    timesReviewed: (existing?.timesReviewed || 0) + 1,
    lastReviewed: new Date().toISOString(),
    nextReviewDate: calculateNextReviewDate(newConfidence),
  };
  
  // Update streak
  const today = new Date().toDateString();
  const lastStudy = progress.lastStudyDate ? new Date(progress.lastStudyDate).toDateString() : null;
  
  if (lastStudy !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastStudy === yesterday.toDateString()) {
      progress.currentStreak += 1;
    } else if (lastStudy !== today) {
      progress.currentStreak = 1;
    }
    progress.lastStudyDate = new Date().toISOString();
  }
  
  // Count words learned (confidence >= 3)
  progress.totalWordsLearned = Object.values(progress.words)
    .filter(w => w.confidence >= 3).length;
  
  saveProgress(progress);
}

export function saveQuizResult(result: QuizResult): void {
  const progress = getProgress();
  progress.quizHistory.push(result);
  
  // Keep only last 50 quiz results
  if (progress.quizHistory.length > 50) {
    progress.quizHistory = progress.quizHistory.slice(-50);
  }
  
  saveProgress(progress);
}

export function getWordsToReview(): string[] {
  const progress = getProgress();
  const now = new Date();
  
  return Object.values(progress.words)
    .filter(w => {
      if (!w.nextReviewDate) return true;
      return new Date(w.nextReviewDate) <= now;
    })
    .map(w => w.wordId);
}

export function getStats() {
  const progress = getProgress();
  const wordProgresses = Object.values(progress.words);
  
  const totalReviewed = wordProgresses.length;
  const mastered = wordProgresses.filter(w => w.confidence >= 4).length;
  const learning = wordProgresses.filter(w => w.confidence >= 1 && w.confidence < 4).length;
  const needsWork = wordProgresses.filter(w => w.confidence < 1).length;
  
  const avgConfidence = totalReviewed > 0
    ? wordProgresses.reduce((sum, w) => sum + w.confidence, 0) / totalReviewed
    : 0;
  
  const recentQuizzes = progress.quizHistory.slice(-10);
  const avgQuizScore = recentQuizzes.length > 0
    ? recentQuizzes.reduce((sum, q) => sum + (q.score / q.totalQuestions), 0) / recentQuizzes.length * 100
    : 0;
  
  return {
    totalReviewed,
    mastered,
    learning,
    needsWork,
    avgConfidence,
    avgQuizScore,
    currentStreak: progress.currentStreak,
    totalQuizzesTaken: progress.quizHistory.length,
    lastStudyDate: progress.lastStudyDate,
  };
}

