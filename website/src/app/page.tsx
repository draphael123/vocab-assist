'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  getAllSynonyms, 
  calculateWritingScore, 
  upgradeText, 
  findWeakWordsInText,
  getWeakWords,
  toneDescriptions,
  Tone 
} from '@/lib/synonyms'
import { getWordOfTheDay } from '@/lib/vocabulary'
import { Word } from '@/lib/types'
import { 
  Sparkles, ArrowRight, Chrome, Zap, BookOpen, 
  Copy, Check, ArrowUpRight, Lightbulb, PenTool,
  BarChart3, RefreshCw, Download, Briefcase, GraduationCap, 
  Building2, MessageCircle, AlertCircle
} from 'lucide-react'

const toneIcons: Record<Tone, React.ElementType> = {
  formal: Briefcase,
  academic: GraduationCap,
  business: Building2,
  casual: MessageCircle,
}

export default function Home() {
  const [inputWord, setInputWord] = useState('')
  const [selectedTone, setSelectedTone] = useState<Tone>('formal')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [copiedWord, setCopiedWord] = useState<string | null>(null)
  const [wordOfDay, setWordOfDay] = useState<Word | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Sentence rewriter state
  const [inputText, setInputText] = useState('')
  const [upgradedText, setUpgradedText] = useState('')
  const [writingScore, setWritingScore] = useState({ score: 100, weakWordCount: 0, totalWords: 0, suggestions: [] as string[] })
  const [showComparison, setShowComparison] = useState(false)
  const [highlightedText, setHighlightedText] = useState<React.ReactNode>(null)

  useEffect(() => {
    setMounted(true)
    setWordOfDay(getWordOfTheDay())
  }, [])

  useEffect(() => {
    if (inputWord.trim()) {
      const synonyms = getAllSynonyms(inputWord.trim(), selectedTone)
      setSuggestions(synonyms)
    } else {
      setSuggestions([])
    }
  }, [inputWord, selectedTone])

  useEffect(() => {
    if (inputText.trim()) {
      const score = calculateWritingScore(inputText)
      setWritingScore(score)
      
      // Create highlighted text
      const weakWordsFound = findWeakWordsInText(inputText)
      if (weakWordsFound.length > 0) {
        let lastIndex = 0
        const parts: React.ReactNode[] = []
        
        weakWordsFound.forEach((weak, i) => {
          if (weak.index > lastIndex) {
            parts.push(inputText.substring(lastIndex, weak.index))
          }
          parts.push(
            <mark key={i} className="bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-0.5 rounded">
              {weak.word}
            </mark>
          )
          lastIndex = weak.index + weak.length
        })
        
        if (lastIndex < inputText.length) {
          parts.push(inputText.substring(lastIndex))
        }
        
        setHighlightedText(parts)
      } else {
        setHighlightedText(inputText)
      }
    } else {
      setWritingScore({ score: 100, weakWordCount: 0, totalWords: 0, suggestions: [] })
      setHighlightedText(null)
    }
  }, [inputText])

  const handleUpgradeText = () => {
    const upgraded = upgradeText(inputText, selectedTone)
    setUpgradedText(upgraded)
    setShowComparison(true)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedWord(text)
    setTimeout(() => setCopiedWord(null), 2000)
  }

  const copyUpgradedText = async () => {
    await navigator.clipboard.writeText(upgradedText)
    setCopiedWord('upgraded')
    setTimeout(() => setCopiedWord(null), 2000)
  }

  const commonWords = ['good', 'bad', 'big', 'important', 'difficult', 'use', 'make', 'help', 'show', 'think', 'very', 'really']

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Chrome className="w-4 h-4" />
            <span>Chrome Extension Available</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
            Write with
            <span className="gradient-text"> Better Words</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 animate-slide-up stagger-1 max-w-2xl mx-auto">
            Instantly upgrade your vocabulary. Transform basic words into sophisticated alternatives 
            tailored to your writing style.
          </p>
        </div>
      </section>

      {/* Tone Selector */}
      <section className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Writing tone:</span>
          {(Object.keys(toneDescriptions) as Tone[]).map((tone) => {
            const Icon = toneIcons[tone]
            return (
              <button
                key={tone}
                onClick={() => setSelectedTone(tone)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedTone === tone
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tone.charAt(0).toUpperCase() + tone.slice(1)}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Quick Word Upgrader */}
      <section className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Quick Word Upgrade
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Type a word to find {selectedTone} alternatives
              </p>
            </div>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="Type a word like 'good', 'important', 'use'..."
              className="w-full px-6 py-4 text-xl bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 transition-colors"
            />
            {inputWord && (
              <button
                onClick={() => setInputWord('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">Try:</span>
            {commonWords.map((word) => (
              <button
                key={word}
                onClick={() => setInputWord(word)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
              >
                {word}
              </button>
            ))}
          </div>

          {/* Results */}
          {suggestions.length > 0 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)} alternatives for &ldquo;{inputWord}&rdquo;
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {suggestions.map((word) => (
                  <button
                    key={word}
                    onClick={() => copyToClipboard(word)}
                    className="group relative p-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl border border-primary-100 dark:border-primary-800/50 hover:shadow-lg hover:scale-105 transition-all text-left"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {word}
                    </span>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedWord === word ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {inputWord && suggestions.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No {selectedTone} alternatives found for &ldquo;{inputWord}&rdquo;</p>
              <p className="text-sm mt-1">Try a more common word or different tone</p>
            </div>
          )}
        </div>
      </section>

      {/* Sentence Rewriter */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                  Sentence Rewriter
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Paste text to automatically upgrade all weak words
                </p>
              </div>
            </div>
            
            {/* Writing Score */}
            {inputText && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {writingScore.score}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Writing Score
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  writingScore.score >= 80 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                    : writingScore.score >= 50 
                    ? 'bg-amber-100 dark:bg-amber-900/30'
                    : 'bg-rose-100 dark:bg-rose-900/30'
                }`}>
                  <BarChart3 className={`w-6 h-6 ${
                    writingScore.score >= 80 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : writingScore.score >= 50 
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`} />
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Your Text
              </label>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value)
                    setShowComparison(false)
                  }}
                  placeholder="Paste your text here. Weak words will be highlighted..."
                  className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {inputText && highlightedText && (
                  <div className="absolute inset-0 p-4 pointer-events-none overflow-hidden text-transparent">
                    <div className="whitespace-pre-wrap break-words">{highlightedText}</div>
                  </div>
                )}
              </div>
              
              {/* Stats */}
              {inputText && (
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {writingScore.totalWords} words
                  </span>
                  {writingScore.weakWordCount > 0 && (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4" />
                      {writingScore.weakWordCount} weak words found
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upgraded Text
                </label>
                {showComparison && upgradedText && (
                  <button
                    onClick={copyUpgradedText}
                    className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {copiedWord === 'upgraded' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy
                  </button>
                )}
              </div>
              <div className="h-48 p-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-100 dark:border-primary-800/50 rounded-xl overflow-y-auto">
                {showComparison && upgradedText ? (
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{upgradedText}</p>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500">
                    Click &ldquo;Upgrade Text&rdquo; to see the improved version
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {writingScore.suggestions.length > 0 && !showComparison && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="font-medium text-amber-800 dark:text-amber-200">Suggestions</span>
              </div>
              <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                {writingScore.suggestions.map((suggestion, i) => (
                  <li key={i}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={handleUpgradeText}
              disabled={!inputText.trim()}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
                inputText.trim()
                  ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-5 h-5" />
              Upgrade Text ({selectedTone})
            </button>
          </div>
        </div>
      </section>

      {/* Chrome Extension CTA */}
      <section id="get-extension" className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-900 rounded-3xl p-8 md:p-12 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Chrome className="w-10 h-10" />
          </div>

          <h2 className="font-display text-3xl font-bold mb-4">
            Get the Chrome Extension
          </h2>

          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Upgrade your vocabulary while you write. Works in Gmail, Google Docs, 
            LinkedIn, and everywhere else. Auto-highlights weak words as you type!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/extension"
              className="group flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-white/90 transition-all"
            >
              <Download className="w-5 h-5" />
              Get Extension
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-300" />
              Auto-highlight weak words
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-300" />
              One-click replacement
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-300" />
              Works offline
            </span>
          </div>
        </div>
      </section>

      {/* Word of the Day */}
      {wordOfDay && (
        <section className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Word of the Day</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <h3 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {wordOfDay.word}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 italic mb-4">{wordOfDay.partOfSpeech}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{wordOfDay.definition}</p>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                &ldquo;{wordOfDay.example}&rdquo;
              </p>
            </div>

            {wordOfDay.synonyms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Synonyms:</span>
                {wordOfDay.synonyms.map((syn) => (
                  <button
                    key={syn}
                    onClick={() => copyToClipboard(syn)}
                    className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                  >
                    {syn}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        <Link
          href="/upgrade"
          className="group bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 card-hover"
        >
          <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-accent-600 dark:text-accent-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Editor
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Full-featured text editor with history, favorites, and export options.
          </p>
          <span className="text-primary-600 dark:text-primary-400 font-medium text-sm flex items-center gap-1">
            Open editor <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/browse"
          className="group bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 card-hover"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
            Word Library
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Browse 200+ vocabulary words with definitions, examples, and usage.
          </p>
          <span className="text-primary-600 dark:text-primary-400 font-medium text-sm flex items-center gap-1">
            Explore words <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </section>
    </div>
  )
}
