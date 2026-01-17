'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  getAllSynonyms, 
  calculateWritingScore, 
  upgradeText, 
  findWeakWordsInText,
  getWeakWords,
  getAvailableWords,
  toneDescriptions,
  Tone 
} from '@/lib/synonyms'
import { 
  Sparkles, Copy, Check, Download, Trash2, RotateCcw,
  Star, StarOff, Clock, Zap, BarChart3, AlertCircle,
  Briefcase, GraduationCap, Building2, MessageCircle,
  FileText, History, Heart, ArrowDownToLine, ChevronDown
} from 'lucide-react'

const toneIcons: Record<Tone, React.ElementType> = {
  formal: Briefcase,
  academic: GraduationCap,
  business: Building2,
  casual: MessageCircle,
}

interface HistoryItem {
  id: string;
  original: string;
  upgraded: string;
  tone: Tone;
  timestamp: number;
  favorite?: boolean;
}

export default function UpgradePage() {
  const [inputText, setInputText] = useState('')
  const [upgradedText, setUpgradedText] = useState('')
  const [selectedTone, setSelectedTone] = useState<Tone>('formal')
  const [copiedText, setCopiedText] = useState<'input' | 'output' | null>(null)
  const [writingScore, setWritingScore] = useState({ score: 100, weakWordCount: 0, totalWords: 0, suggestions: [] as string[] })
  const [mounted, setMounted] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMounted(true)
    // Load history from localStorage
    const savedHistory = localStorage.getItem('vocab-upgrade-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    if (inputText.trim()) {
      const score = calculateWritingScore(inputText)
      setWritingScore(score)
    } else {
      setWritingScore({ score: 100, weakWordCount: 0, totalWords: 0, suggestions: [] })
    }
  }, [inputText])

  const handleUpgrade = () => {
    if (!inputText.trim()) return
    
    const upgraded = upgradeText(inputText, selectedTone)
    setUpgradedText(upgraded)
    
    // Save to history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      original: inputText,
      upgraded: upgraded,
      tone: selectedTone,
      timestamp: Date.now()
    }
    
    const newHistory = [newItem, ...history.slice(0, 19)]
    setHistory(newHistory)
    localStorage.setItem('vocab-upgrade-history', JSON.stringify(newHistory))
  }

  const copyToClipboard = async (text: string, type: 'input' | 'output') => {
    await navigator.clipboard.writeText(text)
    setCopiedText(type)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const clearAll = () => {
    setInputText('')
    setUpgradedText('')
  }

  const toggleFavorite = (id: string) => {
    const updated = history.map(item => 
      item.id === id ? { ...item, favorite: !item.favorite } : item
    )
    setHistory(updated)
    localStorage.setItem('vocab-upgrade-history', JSON.stringify(updated))
  }

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id)
    setHistory(updated)
    localStorage.setItem('vocab-upgrade-history', JSON.stringify(updated))
  }

  const loadFromHistory = (item: HistoryItem) => {
    setInputText(item.original)
    setUpgradedText(item.upgraded)
    setSelectedTone(item.tone)
    setShowHistory(false)
  }

  const exportText = (format: 'txt' | 'md' | 'both') => {
    let content = ''
    const filename = `upgraded-text-${new Date().toISOString().split('T')[0]}`
    
    if (format === 'txt') {
      content = upgradedText
      downloadFile(content, `${filename}.txt`, 'text/plain')
    } else if (format === 'md') {
      content = `# Upgraded Text\n\n## Original\n\n${inputText}\n\n## Upgraded (${selectedTone})\n\n${upgradedText}`
      downloadFile(content, `${filename}.md`, 'text/markdown')
    } else {
      content = `Original:\n${inputText}\n\n---\n\nUpgraded (${selectedTone}):\n${upgradedText}`
      downloadFile(content, `${filename}.txt`, 'text/plain')
    }
    
    setShowExport(false)
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const availableWords = getAvailableWords()
  const weakWords = getWeakWords()

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
        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Advanced <span className="gradient-text">Text Upgrader</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Transform your writing with sophisticated vocabulary. Paste text, choose your tone, 
          and watch weak words become powerful alternatives.
        </p>
      </div>

      {/* Tone Selector */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
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
              title={toneDescriptions[tone]}
            >
              <Icon className="w-4 h-4" />
              <span>{tone.charAt(0).toUpperCase() + tone.slice(1)}</span>
            </button>
          )
        })}
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-center gap-6 flex-wrap text-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-300">{writingScore.totalWords} words</span>
        </div>
        
        {writingScore.weakWordCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-700 dark:text-amber-300">{writingScore.weakWordCount} weak words</span>
          </div>
        )}
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          writingScore.score >= 80 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' 
            : writingScore.score >= 50 
            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50'
            : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50'
        }`}>
          <BarChart3 className={`w-4 h-4 ${
            writingScore.score >= 80 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : writingScore.score >= 50 
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-rose-600 dark:text-rose-400'
          }`} />
          <span className={`font-semibold ${
            writingScore.score >= 80 
              ? 'text-emerald-700 dark:text-emerald-300' 
              : writingScore.score >= 50 
              ? 'text-amber-700 dark:text-amber-300'
              : 'text-rose-700 dark:text-rose-300'
          }`}>{writingScore.score} score</span>
        </div>
      </div>

      {/* Main Editor */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Original Text</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(inputText, 'input')}
                disabled={!inputText}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                title="Copy"
              >
                {copiedText === 'input' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={clearAll}
                disabled={!inputText}
                className="p-2 text-gray-500 hover:text-rose-500 disabled:opacity-50"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value)
              setUpgradedText('')
            }}
            placeholder="Paste or type your text here. Weak words will be highlighted and upgraded..."
            className="w-full h-80 p-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none"
          />
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upgraded Text</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(upgradedText, 'output')}
                disabled={!upgradedText}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                title="Copy"
              >
                {copiedText === 'output' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowExport(!showExport)}
                  disabled={!upgradedText}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                  title="Export"
                >
                  <Download className="w-4 h-4" />
                </button>
                {showExport && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                    <button
                      onClick={() => exportText('txt')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export as .txt
                    </button>
                    <button
                      onClick={() => exportText('md')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export as .md
                    </button>
                    <button
                      onClick={() => exportText('both')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Both versions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="h-80 p-4 overflow-y-auto">
            {upgradedText ? (
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{upgradedText}</p>
            ) : (
              <p className="text-gray-400 dark:text-gray-500">
                Click &ldquo;Upgrade Text&rdquo; to see the improved version with {selectedTone} vocabulary
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {writingScore.suggestions.length > 0 && !upgradedText && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-100 dark:border-amber-800/50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-amber-800 dark:text-amber-200">Quick Suggestions</span>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-amber-700 dark:text-amber-300">
            {writingScore.suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <button
          onClick={handleUpgrade}
          disabled={!inputText.trim()}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
            inputText.trim()
              ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Zap className="w-5 h-5" />
          Upgrade to {selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)}
        </button>
        
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:border-primary-300 transition-all"
        >
          <History className="w-5 h-5" />
          History ({history.length})
          <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Upgrades</span>
          </div>
          
          {history.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No history yet. Start upgrading text!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {history.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs font-medium">
                          {item.tone}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.original}</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1 line-clamp-2">{item.upgraded}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                      >
                        {item.favorite ? <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> : <StarOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => loadFromHistory(item)}
                        className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reference Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Supported Words */}
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50">
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-4">
            Supported Words ({availableWords.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {availableWords.map((word) => (
              <span
                key={word}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Weak Words */}
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50">
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-4">
            Weak Words to Avoid ({weakWords.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {weakWords.map((word) => (
              <span
                key={word}
                className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Download Extension CTA */}
      <div className="bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-2xl p-6 border border-primary-200 dark:border-primary-800/50 text-center">
        <ArrowDownToLine className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
          Get the Chrome Extension
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
          Upgrade your vocabulary directly while typing in Gmail, Google Docs, and more!
        </p>
        <Link
          href="/extension"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
        >
          <Download className="w-5 h-5" />
          Install Extension
        </Link>
      </div>
    </div>
  )
}
