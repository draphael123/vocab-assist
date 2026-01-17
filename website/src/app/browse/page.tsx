'use client'

import { useEffect, useState, useMemo } from 'react'
import { getAllWords, searchWords, getLevelColor, getCategoryIcon } from '@/lib/vocabulary'
import { Word } from '@/lib/types'
import WordCard from '@/components/WordCard'
import { Search, Filter, X, ChevronDown, Grid3X3, List } from 'lucide-react'

type ViewMode = 'grid' | 'list'
type SortOption = 'alphabetical' | 'level' | 'category'

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const allWords = getAllWords()

  const filteredWords = useMemo(() => {
    let words = searchQuery ? searchWords(searchQuery) : allWords

    if (filterLevel !== 'all') {
      words = words.filter(w => w.level === filterLevel)
    }

    if (filterCategory !== 'all') {
      words = words.filter(w => w.category === filterCategory)
    }

    // Sort
    words = [...words].sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.word.localeCompare(b.word)
        case 'level':
          const levelOrder = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 }
          return levelOrder[a.level] - levelOrder[b.level]
        case 'category':
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

    return words
  }, [allWords, searchQuery, filterLevel, filterCategory, sortBy])

  const levelCounts = useMemo(() => {
    return {
      all: allWords.length,
      beginner: allWords.filter(w => w.level === 'beginner').length,
      intermediate: allWords.filter(w => w.level === 'intermediate').length,
      advanced: allWords.filter(w => w.level === 'advanced').length,
      expert: allWords.filter(w => w.level === 'expert').length,
    }
  }, [allWords])

  const categoryCounts = useMemo(() => {
    return {
      all: allWords.length,
      general: allWords.filter(w => w.category === 'general').length,
      technical: allWords.filter(w => w.category === 'technical').length,
      business: allWords.filter(w => w.category === 'business').length,
      academic: allWords.filter(w => w.category === 'academic').length,
    }
  }, [allWords])

  const clearFilters = () => {
    setSearchQuery('')
    setFilterLevel('all')
    setFilterCategory('all')
    setSortBy('alphabetical')
  }

  const hasActiveFilters = searchQuery || filterLevel !== 'all' || filterCategory !== 'all'

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Browse Vocabulary
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore {allWords.length} words across all categories
          </p>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-4 border border-gray-200/50 dark:border-gray-800/50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search words, definitions, or synonyms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="md:inline hidden">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary-500" />
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* View Mode */}
          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Level Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Difficulty Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'beginner', 'intermediate', 'advanced', 'expert'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setFilterLevel(level)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filterLevel === level
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)} ({levelCounts[level]})
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'general', 'technical', 'business', 'academic'] as const).map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                        filterCategory === category
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category !== 'all' && <span>{getCategoryIcon(category)}</span>}
                      {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryCounts[category]})
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="alphabetical">Alphabetical</option>
                  <option value="level">Difficulty Level</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredWords.length}</span> words
        </p>
      </div>

      {/* Words Grid/List */}
      {filteredWords.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
        }>
          {filteredWords.map((word, index) => (
            <div
              key={word.id}
              className="animate-fade-in"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              {viewMode === 'grid' ? (
                <WordCard
                  word={word}
                  onClick={() => setSelectedWord(word)}
                />
              ) : (
                <div
                  onClick={() => setSelectedWord(word)}
                  className="bg-white dark:bg-[#1a1a2e] rounded-xl p-4 border border-gray-200/50 dark:border-gray-800/50 cursor-pointer hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                        {word.word}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                        {word.partOfSpeech}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                      {word.definition}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(word.category)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(word.level)}`}>
                      {word.level}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-12 border border-gray-200/50 dark:border-gray-800/50 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            No words found matching your criteria.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedWord(null)}
        >
          <div
            className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedWord.word}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 italic">
                  {selectedWord.partOfSpeech}
                </p>
              </div>
              <button
                onClick={() => setSelectedWord(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(selectedWord.level)}`}>
                {selectedWord.level}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                {getCategoryIcon(selectedWord.category)} {selectedWord.category}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Definition
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {selectedWord.definition}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Example
                </h3>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  &ldquo;{selectedWord.example}&rdquo;
                </p>
              </div>

              {selectedWord.synonyms.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Synonyms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWord.synonyms.map((syn) => (
                      <span
                        key={syn}
                        className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedWord.antonyms.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Antonyms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWord.antonyms.map((ant) => (
                      <span
                        key={ant}
                        className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-lg text-sm font-medium"
                      >
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

