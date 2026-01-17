'use client'

import { Word } from '@/lib/types'
import { getLevelColor, getCategoryIcon } from '@/lib/vocabulary'

interface WordCardProps {
  word: Word
  onClick?: () => void
  showFull?: boolean
}

export default function WordCard({ word, onClick, showFull = false }: WordCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 card-hover ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          {word.word}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(word.level)}`}>
          {word.level}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400 italic">
          {word.partOfSpeech}
        </span>
        <span className="text-sm">
          {getCategoryIcon(word.category)}
        </span>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {word.definition}
      </p>

      {showFull && (
        <>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              &ldquo;{word.example}&rdquo;
            </p>
          </div>

          {word.synonyms.length > 0 && (
            <div className="mb-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Synonyms
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {word.synonyms.map((syn) => (
                  <span
                    key={syn}
                    className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-md text-sm"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {word.antonyms.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Antonyms
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {word.antonyms.map((ant) => (
                  <span
                    key={ant}
                    className="px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-md text-sm"
                  >
                    {ant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!showFull && word.synonyms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {word.synonyms.slice(0, 3).map((syn) => (
            <span
              key={syn}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-xs"
            >
              {syn}
            </span>
          ))}
          {word.synonyms.length > 3 && (
            <span className="px-2 py-1 text-gray-400 text-xs">
              +{word.synonyms.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  )
}

