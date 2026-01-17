'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getSynonymsForCommonWord, searchWords, getWordOfTheDay, getAllWords } from '@/lib/vocabulary'
import { Word } from '@/lib/types'
import { 
  Sparkles, ArrowRight, Chrome, Zap, BookOpen, 
  Copy, Check, ArrowUpRight, Lightbulb, PenTool
} from 'lucide-react'

export default function Home() {
  const [inputWord, setInputWord] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [copiedWord, setCopiedWord] = useState<string | null>(null)
  const [wordOfDay, setWordOfDay] = useState<Word | null>(null)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    setWordOfDay(getWordOfTheDay())
  }, [])

  useEffect(() => {
    if (inputWord.trim()) {
      const synonyms = getSynonymsForCommonWord(inputWord.trim())
      setSuggestions(synonyms)
    } else {
      setSuggestions([])
    }
  }, [inputWord])

  const copyToClipboard = async (word: string) => {
    await navigator.clipboard.writeText(word)
    setCopiedWord(word)
    setTimeout(() => setCopiedWord(null), 2000)
  }

  const commonWords = ['good', 'bad', 'big', 'small', 'important', 'difficult', 'use', 'make', 'change', 'help', 'show', 'think']

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
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
            Instantly upgrade your vocabulary. Find sophisticated synonyms for common words 
            and transform your writing from ordinary to extraordinary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
            <a
              href="#get-extension"
              className="group flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
            >
              <Chrome className="w-5 h-5" />
              Get Chrome Extension
            </a>
            <Link
              href="/upgrade"
              className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              Try Word Upgrader
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-900/30 rounded-2xl rotate-12 float-animation opacity-50" />
        <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 bg-accent-200 dark:bg-accent-900/30 rounded-xl -rotate-12 float-animation-delayed opacity-50" />
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
                Upgrade Your Words
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Type a common word to find better alternatives
              </p>
            </div>
          </div>

          <div className="relative mb-6">
            <input
              ref={inputRef}
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
            {commonWords.slice(0, 8).map((word) => (
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
                  Better alternatives for &ldquo;{inputWord}&rdquo;
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              <p>No suggestions found for &ldquo;{inputWord}&rdquo;</p>
              <p className="text-sm mt-1">Try a more common word</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upgrade your vocabulary in seconds with our Chrome extension
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: PenTool,
              title: 'Select Any Word',
              description: 'Highlight a word in any text field while writing emails, documents, or messages',
              step: '1',
            },
            {
              icon: Lightbulb,
              title: 'Get Suggestions',
              description: 'Press the shortcut or right-click to see sophisticated alternatives instantly',
              step: '2',
            },
            {
              icon: Sparkles,
              title: 'Replace & Impress',
              description: 'Click to replace with a better word and elevate your writing immediately',
              step: '3',
            },
          ].map(({ icon: Icon, title, description, step }) => (
            <div
              key={title}
              className="relative bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {step}
              </div>
              <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Word of the Day */}
      {wordOfDay && (
        <section className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-900 rounded-3xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Word of the Day</p>
                <p className="text-white/60 text-xs">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <h3 className="font-display text-4xl font-bold mb-2">{wordOfDay.word}</h3>
            <p className="text-white/80 italic mb-4">{wordOfDay.partOfSpeech}</p>
            <p className="text-lg mb-6">{wordOfDay.definition}</p>
            
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <p className="text-sm italic">&ldquo;{wordOfDay.example}&rdquo;</p>
            </div>

            {wordOfDay.synonyms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-white/60 text-sm">Similar:</span>
                {wordOfDay.synonyms.map((syn) => (
                  <span
                    key={syn}
                    className="px-3 py-1 bg-white/20 rounded-lg text-sm cursor-pointer hover:bg-white/30 transition-colors"
                    onClick={() => copyToClipboard(syn)}
                  >
                    {syn}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Get Extension CTA */}
      <section id="get-extension" className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-800/50 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Chrome className="w-10 h-10 text-white" />
          </div>

          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Get the Chrome Extension
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Upgrade your vocabulary everywhere you write. Works in Gmail, Google Docs, 
            LinkedIn, Twitter, and any website with text input.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="/vocab-assist-extension.zip"
              download
              className="group flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
            >
              <Chrome className="w-5 h-5" />
              Download Extension
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              Free forever
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              No account required
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              Works offline
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/upgrade"
            className="group bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
              Word Upgrader
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Transform basic words into sophisticated alternatives. Perfect for emails, essays, and professional writing.
            </p>
            <span className="text-primary-600 dark:text-primary-400 font-medium text-sm flex items-center gap-1">
              Try it now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              Browse 200+ sophisticated words with definitions, examples, and synonyms. Filter by category and difficulty.
            </p>
            <span className="text-primary-600 dark:text-primary-400 font-medium text-sm flex items-center gap-1">
              Explore words <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
