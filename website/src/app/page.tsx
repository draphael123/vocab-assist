'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getWordOfTheDay, getAllWords } from '@/lib/vocabulary'
import { getStats } from '@/lib/storage'
import { Word } from '@/lib/types'
import WordCard from '@/components/WordCard'
import { Sparkles, ArrowRight, BookOpen, Brain, Trophy, Flame } from 'lucide-react'

export default function Home() {
  const [wordOfDay, setWordOfDay] = useState<Word | null>(null)
  const [stats, setStats] = useState({ totalReviewed: 0, mastered: 0, currentStreak: 0 })
  const [mounted, setMounted] = useState(false)
  const totalWords = getAllWords().length

  useEffect(() => {
    setMounted(true)
    setWordOfDay(getWordOfTheDay())
    setStats(getStats())
  }, [])

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
      <section className="relative py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>{totalWords}+ words to master</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
            Elevate Your
            <span className="gradient-text"> Vocabulary</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 animate-slide-up stagger-1">
            Master sophisticated words with flashcards, quizzes, and spaced repetition. 
            Transform your communication from ordinary to extraordinary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
            <Link
              href="/learn"
              className="group flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
            >
              Start Learning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/browse"
              className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              Browse Words
            </Link>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-900/30 rounded-2xl rotate-12 float-animation opacity-50" />
        <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 bg-accent-200 dark:bg-accent-900/30 rounded-xl -rotate-12 float-animation-delayed opacity-50" />
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Words Available', value: totalWords, color: 'primary' },
          { icon: Brain, label: 'Words Reviewed', value: stats.totalReviewed, color: 'blue' },
          { icon: Trophy, label: 'Words Mastered', value: stats.mastered, color: 'amber' },
          { icon: Flame, label: 'Day Streak', value: stats.currentStreak, color: 'rose' },
        ].map(({ icon: Icon, label, value, color }, index) => (
          <div
            key={label}
            className={`bg-white dark:bg-[#1a1a2e] rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50 animate-slide-up`}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div className={`w-10 h-10 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </section>

      {/* Word of the Day */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Word of the Day
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {wordOfDay && <WordCard word={wordOfDay} showFull />}
      </section>

      {/* Quick Actions */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            href: '/learn',
            title: 'Flashcards',
            description: 'Practice with interactive flashcards and track your confidence',
            icon: BookOpen,
            gradient: 'from-primary-500 to-primary-600',
          },
          {
            href: '/quiz',
            title: 'Take a Quiz',
            description: 'Test your knowledge with multiple choice questions',
            icon: Brain,
            gradient: 'from-accent-500 to-accent-600',
          },
          {
            href: '/progress',
            title: 'View Progress',
            description: 'See your learning stats and spaced repetition schedule',
            icon: Trophy,
            gradient: 'from-emerald-500 to-emerald-600',
          },
        ].map(({ href, title, description, icon: Icon, gradient }) => (
          <Link
            key={href}
            href={href}
            className="group relative overflow-hidden bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 card-hover"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
            
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>

            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {description}
            </p>

            <div className="mt-4 flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium text-sm">
              Get started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}

