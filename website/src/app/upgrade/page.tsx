'use client'

import { useState, useEffect, useRef } from 'react'
import { getSynonymsForCommonWord, searchWords, getAllWords } from '@/lib/vocabulary'
import { Word } from '@/lib/types'
import { 
  Sparkles, Copy, Check, ArrowRight, Zap, 
  History, Star, Trash2, BookOpen
} from 'lucide-react'

interface HistoryItem {
  original: string
  replacement: string
  timestamp: number
}

export default function UpgradePage() {
  const [inputText, setInputText] = useState('')
  const [selectedWord, setSelectedWord] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [copiedWord, setCopiedWord] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMounted(true)
    // Load history and favorites from localStorage
    const savedHistory = localStorage.getItem('vocab_history')
    const savedFavorites = localStorage.getItem('vocab_favorites')
    if (savedHistory) setHistory(JSON.parse(savedHistory))
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
  }, [])

  useEffect(() => {
    if (selectedWord.trim()) {
      const synonyms = getSynonymsForCommonWord(selectedWord.trim().toLowerCase())
      
      // Also search vocabulary for the word
      if (synonyms.length === 0) {
        const vocabWord = getAllWords().find(
          w => w.word.toLowerCase() === selectedWord.trim().toLowerCase()
        )
        if (vocabWord) {
          setSuggestions(vocabWord.synonyms)
        } else {
          setSuggestions([])
        }
      } else {
        setSuggestions(synonyms)
      }
    } else {
      setSuggestions([])
    }
  }, [selectedWord])

  const handleTextSelect = () => {
    if (!textareaRef.current) return
    const text = textareaRef.current.value
    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    
    if (start !== end) {
      const selected = text.substring(start, end).trim()
      if (selected && !selected.includes(' ')) {
        setSelectedWord(selected)
      }
    }
  }

  const replaceWord = (newWord: string) => {
    if (!textareaRef.current || !selectedWord) return
    
    const text = textareaRef.current.value
    const newText = text.replace(new RegExp(`\\b${selectedWord}\\b`, 'gi'), newWord)
    setInputText(newText)
    
    // Add to history
    const newHistory = [
      { original: selectedWord, replacement: newWord, timestamp: Date.now() },
      ...history.slice(0, 19)
    ]
    setHistory(newHistory)
    localStorage.setItem('vocab_history', JSON.stringify(newHistory))
    
    setSelectedWord('')
    setSuggestions([])
  }

  const copyToClipboard = async (word: string) => {
    await navigator.clipboard.writeText(word)
    setCopiedWord(word)
    setTimeout(() => setCopiedWord(null), 2000)
  }

  const toggleFavorite = (word: string) => {
    const newFavorites = favorites.includes(word)
      ? favorites.filter(f => f !== word)
      : [...favorites, word]
    setFavorites(newFavorites)
    localStorage.setItem('vocab_favorites', JSON.stringify(newFavorites))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('vocab_history')
  }

  const commonUpgrades = [
    { basic: 'good', upgrades: ['excellent', 'outstanding', 'exceptional'] },
    { basic: 'bad', upgrades: ['poor', 'inadequate', 'substandard'] },
    { basic: 'big', upgrades: ['substantial', 'significant', 'considerable'] },
    { basic: 'small', upgrades: ['minimal', 'modest', 'negligible'] },
    { basic: 'important', upgrades: ['crucial', 'essential', 'vital'] },
    { basic: 'difficult', upgrades: ['challenging', 'demanding', 'arduous'] },
    { basic: 'use', upgrades: ['utilize', 'employ', 'leverage'] },
    { basic: 'help', upgrades: ['assist', 'facilitate', 'support'] },
    { basic: 'show', upgrades: ['demonstrate', 'illustrate', 'reveal'] },
    { basic: 'make', upgrades: ['create', 'develop', 'establish'] },
  ]

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Word Upgrader
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Paste your text, select a word to upgrade, and choose a more sophisticated alternative
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent-500" />
                <span className="font-medium text-gray-900 dark:text-white">Your Text</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Select a word to see suggestions
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onSelect={handleTextSelect}
              onMouseUp={handleTextSelect}
              placeholder="Paste or type your text here. Then select any word to find better alternatives...

Example: This is a good idea that could help make things better."
              className="w-full h-64 p-6 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none text-lg leading-relaxed"
            />
          </div>

          {/* Selected Word & Suggestions */}
          {selectedWord && (
            <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Upgrades for <span className="font-bold text-primary-600 dark:text-primary-400">&ldquo;{selectedWord}&rdquo;</span>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedWord('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {suggestions.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {suggestions.map((word) => (
                    <button
                      key={word}
                      onClick={() => replaceWord(word)}
                      className="group relative p-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl border border-primary-100 dark:border-primary-800/50 hover:shadow-lg hover:scale-105 transition-all text-left"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {word}
                      </span>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(word)
                          }}
                          className="p-1 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              favorites.includes(word)
                                ? 'fill-accent-500 text-accent-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(word)
                          }}
                          className="p-1 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded"
                        >
                          {copiedWord === word ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                        Click to replace
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No suggestions found for this word</p>
                  <p className="text-sm mt-1">Try selecting a more common word</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Reference */}
          <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              <span className="font-medium text-gray-900 dark:text-white">Quick Reference</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {commonUpgrades.map(({ basic, upgrades }) => (
                <div key={basic} className="flex items-center gap-3">
                  <span className="text-gray-500 dark:text-gray-400 w-20 font-medium">{basic}</span>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                  <div className="flex flex-wrap gap-1">
                    {upgrades.map((word) => (
                      <button
                        key={word}
                        onClick={() => copyToClipboard(word)}
                        className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-sm hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-accent-500 fill-accent-500" />
                <span className="font-medium text-gray-900 dark:text-white">Favorites</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {favorites.map((word) => (
                  <button
                    key={word}
                    onClick={() => copyToClipboard(word)}
                    className="group relative px-3 py-1.5 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 rounded-lg text-sm hover:bg-accent-100 dark:hover:bg-accent-900/40 transition-colors"
                  >
                    {word}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(word)
                      }}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">Recent Upgrades</span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {history.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.slice(0, 10).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm"
                  >
                    <span className="text-gray-500 dark:text-gray-400 line-through">
                      {item.original}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {item.replacement}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No upgrades yet. Select a word in your text to get started!
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800/50">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Select any word by highlighting it</li>
              <li>• Click a suggestion to replace instantly</li>
              <li>• Star words to save them for later</li>
              <li>• Try the Chrome extension for inline suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

