'use client'

import { useState } from 'react'
import { Word } from '@/lib/types'
import { getLevelColor, getCategoryIcon } from '@/lib/vocabulary'
import { RotateCcw } from 'lucide-react'

interface FlashcardProps {
  word: Word
  onKnew: () => void
  onDidntKnow: () => void
}

export default function Flashcard({ word, onKnew, onDidntKnow }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleKnew = () => {
    setIsFlipped(false)
    onKnew()
  }

  const handleDidntKnow = () => {
    setIsFlipped(false)
    onDidntKnow()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`flip-card h-[400px] md:h-[450px] cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front bg-white dark:bg-[#1a1a2e] rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getLevelColor(word.level)}`}>
                {word.level}
              </span>
              <span className="text-2xl">{getCategoryIcon(word.category)}</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <h2 className="font-display text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                {word.word}
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 italic">
                {word.partOfSpeech}
              </p>
            </div>

            <div className="text-center text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Click to reveal definition
            </div>
          </div>

          {/* Back */}
          <div className="flip-card-back bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-900 rounded-3xl shadow-xl p-8 flex flex-col text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl font-bold">{word.word}</h3>
              <span className="text-white/80 text-sm italic">{word.partOfSpeech}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div>
                <p className="text-lg leading-relaxed">{word.definition}</p>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm font-medium mb-1 opacity-80">Example</p>
                <p className="text-sm italic opacity-90">&ldquo;{word.example}&rdquo;</p>
              </div>

              {word.synonyms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-80">
                    Synonyms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {word.synonyms.map((syn) => (
                      <span
                        key={syn}
                        className="px-3 py-1 bg-white/20 rounded-lg text-sm"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {word.antonyms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-80">
                    Antonyms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {word.antonyms.map((ant) => (
                      <span
                        key={ant}
                        className="px-3 py-1 bg-white/10 rounded-lg text-sm"
                      >
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-sm text-white/60 flex items-center justify-center gap-2 mt-2">
              <RotateCcw className="w-4 h-4" />
              Click to flip back
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={handleDidntKnow}
          className="flex-1 max-w-[200px] py-4 px-6 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-xl font-semibold hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
        >
          Didn&apos;t Know
        </button>
        <button
          onClick={handleKnew}
          className="flex-1 max-w-[200px] py-4 px-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
        >
          Knew It!
        </button>
      </div>
    </div>
  )
}

