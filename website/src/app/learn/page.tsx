'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAllWords, getRandomWords } from '@/lib/vocabulary'
import { updateWordConfidence, getWordsToReview, getWordProgress } from '@/lib/storage'
import { Word } from '@/lib/types'
import Flashcard from '@/components/Flashcard'
import { Shuffle, RotateCcw, Filter, ChevronDown, CheckCircle2 } from 'lucide-react'

type StudyMode = 'all' | 'review' | 'new'
type FilterLevel = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert'

export default function LearnPage() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [studyMode, setStudyMode] = useState<StudyMode>('all')
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, knew: 0, didntKnow: 0 })
  const [mounted, setMounted] = useState(false)

  const loadWords = useCallback(() => {
    let wordList = getAllWords()

    // Filter by level
    if (filterLevel !== 'all') {
      wordList = wordList.filter(w => w.level === filterLevel)
    }

    // Filter by study mode
    if (studyMode === 'review') {
      const reviewIds = getWordsToReview()
      wordList = wordList.filter(w => reviewIds.includes(w.id))
    } else if (studyMode === 'new') {
      wordList = wordList.filter(w => !getWordProgress(w.id))
    }

    // Shuffle
    const shuffled = [...wordList].sort(() => Math.random() - 0.5)
    setWords(shuffled)
    setCurrentIndex(0)
    setSessionStats({ reviewed: 0, knew: 0, didntKnow: 0 })
  }, [studyMode, filterLevel])

  useEffect(() => {
    setMounted(true)
    loadWords()
  }, [loadWords])

  const handleKnew = () => {
    if (words[currentIndex]) {
      updateWordConfidence(words[currentIndex].id, true)
      setSessionStats(prev => ({
        reviewed: prev.reviewed + 1,
        knew: prev.knew + 1,
        didntKnow: prev.didntKnow,
      }))
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleDidntKnow = () => {
    if (words[currentIndex]) {
      updateWordConfidence(words[currentIndex].id, false)
      setSessionStats(prev => ({
        reviewed: prev.reviewed + 1,
        knew: prev.knew,
        didntKnow: prev.didntKnow + 1,
      }))
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleShuffle = () => {
    loadWords()
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSessionStats({ reviewed: 0, knew: 0, didntKnow: 0 })
  }

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentWord = words[currentIndex]
  const progress = words.length > 0 ? ((currentIndex) / words.length) * 100 : 0
  const isComplete = currentIndex >= words.length && words.length > 0

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Learn with Flashcards
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {words.length} words in current deck
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Study Mode
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Words' },
                  { value: 'review', label: 'Due for Review' },
                  { value: 'new', label: 'New Words' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setStudyMode(value as StudyMode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      studyMode === value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Levels' },
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                  { value: 'expert', label: 'Expert' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFilterLevel(value as FilterLevel)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterLevel === value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-4 border border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Card {Math.min(currentIndex + 1, words.length)} of {words.length}
          </span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-emerald-600 dark:text-emerald-400">
              ✓ {sessionStats.knew} knew
            </span>
            <span className="text-rose-600 dark:text-rose-400">
              ✗ {sessionStats.didntKnow} learning
            </span>
          </div>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500 progress-animate"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard or Complete State */}
      {isComplete ? (
        <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-12 border border-gray-200/50 dark:border-gray-800/50 text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>

          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Session Complete!
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            You reviewed {sessionStats.reviewed} words. 
            You knew {sessionStats.knew} and are still learning {sessionStats.didntKnow}.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Review Again
            </button>
            <button
              onClick={handleShuffle}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors"
            >
              <Shuffle className="w-5 h-5" />
              New Deck
            </button>
          </div>
        </div>
      ) : words.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-12 border border-gray-200/50 dark:border-gray-800/50 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            No words match your current filters.
          </p>
          <button
            onClick={() => {
              setStudyMode('all')
              setFilterLevel('all')
            }}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : currentWord ? (
        <Flashcard
          word={currentWord}
          onKnew={handleKnew}
          onDidntKnow={handleDidntKnow}
        />
      ) : null}
    </div>
  )
}

