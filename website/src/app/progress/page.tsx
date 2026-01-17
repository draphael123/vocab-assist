'use client'

import { useEffect, useState } from 'react'
import { getStats, getProgress, getWordsToReview } from '@/lib/storage'
import { getAllWords, getLevelColor } from '@/lib/vocabulary'
import { Word, WordProgress } from '@/lib/types'
import { 
  Trophy, Flame, Brain, Target, Calendar, TrendingUp, 
  BookOpen, Star, Clock, BarChart3 
} from 'lucide-react'

interface Stats {
  totalReviewed: number
  mastered: number
  learning: number
  needsWork: number
  avgConfidence: number
  avgQuizScore: number
  currentStreak: number
  totalQuizzesTaken: number
  lastStudyDate: string | null
}

export default function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [wordsToReview, setWordsToReview] = useState<string[]>([])
  const [wordProgressList, setWordProgressList] = useState<(WordProgress & { word: Word })[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentStats = getStats()
    setStats(currentStats)
    setWordsToReview(getWordsToReview())

    // Get all word progress with word data
    const progress = getProgress()
    const allWords = getAllWords()
    const progressWithWords = Object.values(progress.words)
      .map(wp => {
        const word = allWords.find(w => w.id === wp.wordId)
        if (!word) return null
        return { ...wp, word }
      })
      .filter(Boolean) as (WordProgress & { word: Word })[]
    
    // Sort by last reviewed (most recent first)
    progressWithWords.sort((a, b) => {
      if (!a.lastReviewed) return 1
      if (!b.lastReviewed) return -1
      return new Date(b.lastReviewed).getTime() - new Date(a.lastReviewed).getTime()
    })
    
    setWordProgressList(progressWithWords)
  }, [])

  if (!mounted || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalWords = getAllWords().length
  const progressPercentage = (stats.totalReviewed / totalWords) * 100

  const confidenceLabels = ['Not Started', 'Learning', 'Familiar', 'Good', 'Strong', 'Mastered']
  const confidenceColors = [
    'bg-gray-200 dark:bg-gray-700',
    'bg-rose-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-emerald-400',
    'bg-emerald-600',
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Your Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your vocabulary learning journey
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            icon: Flame, 
            label: 'Day Streak', 
            value: stats.currentStreak,
            color: 'rose',
            suffix: stats.currentStreak === 1 ? ' day' : ' days'
          },
          { 
            icon: BookOpen, 
            label: 'Words Reviewed', 
            value: stats.totalReviewed,
            color: 'primary',
            suffix: ` / ${totalWords}`
          },
          { 
            icon: Trophy, 
            label: 'Mastered', 
            value: stats.mastered,
            color: 'amber',
            suffix: ' words'
          },
          { 
            icon: Brain, 
            label: 'Quiz Score', 
            value: Math.round(stats.avgQuizScore),
            color: 'emerald',
            suffix: '%'
          },
        ].map(({ icon: Icon, label, value, color, suffix }, index) => (
          <div
            key={label}
            className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-12 h-12 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-3`}>
              <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {suffix}
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
              Overall Progress
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stats.totalReviewed} of {totalWords} words started
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000 progress-animate"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <span className="font-medium text-primary-600 dark:text-primary-400">
              {progressPercentage.toFixed(1)}% complete
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Breakdown by status */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.mastered}
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Mastered</p>
          </div>
          <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.learning}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">Learning</p>
          </div>
          <div className="text-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {stats.needsWork}
            </p>
            <p className="text-sm text-rose-700 dark:text-rose-300">Needs Work</p>
          </div>
        </div>
      </div>

      {/* Due for Review */}
      {wordsToReview.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                Due for Review
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {wordsToReview.length} words ready for spaced repetition review
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {wordsToReview.slice(0, 20).map(wordId => {
              const wordProgress = wordProgressList.find(wp => wp.wordId === wordId)
              return (
                <span
                  key={wordId}
                  className="px-3 py-1.5 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 rounded-lg text-sm font-medium"
                >
                  {wordProgress?.word.word || wordId}
                </span>
              )
            })}
            {wordsToReview.length > 20 && (
              <span className="px-3 py-1.5 text-gray-500 text-sm">
                +{wordsToReview.length - 20} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {wordProgressList.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                Word Progress
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your confidence level for each word
              </p>
            </div>
          </div>

          {/* Confidence Legend */}
          <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            {confidenceLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${confidenceColors[i]}`} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {wordProgressList.slice(0, 30).map((wp) => (
              <div
                key={wp.wordId}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {wp.word.word}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getLevelColor(wp.word.level)}`}>
                      {wp.word.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Reviewed {wp.timesReviewed}x</span>
                    {wp.lastReviewed && (
                      <span>
                        Last: {new Date(wp.lastReviewed).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Confidence bar */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-4 h-4 rounded ${
                          level <= wp.confidence
                            ? confidenceColors[wp.confidence]
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-6 text-right">
                    {wp.confidence}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {wordProgressList.length > 30 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Showing 30 of {wordProgressList.length} words
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {wordProgressList.length === 0 && (
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-12 border border-gray-200/50 dark:border-gray-800/50 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Progress Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start learning with flashcards or take a quiz to track your vocabulary progress here.
          </p>
          <a
            href="/learn"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Start Learning
          </a>
        </div>
      )}

      {/* Spaced Repetition Info */}
      <div className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-900/30 dark:to-accent-900/30 rounded-2xl p-6 border border-primary-200/50 dark:border-primary-800/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2">
              Spaced Repetition Schedule
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Your review schedule is based on confidence levels. Words you know well are shown less frequently, 
              while challenging words appear more often.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { level: '0-1', days: '1 day' },
                { level: '2', days: '2 days' },
                { level: '3', days: '4 days' },
                { level: '4', days: '7 days' },
                { level: '5', days: '14 days' },
              ].map(({ level, days }) => (
                <span
                  key={level}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  Level {level} → {days}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

