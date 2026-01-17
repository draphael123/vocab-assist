'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAllWords, getRandomWords, getLevelColor } from '@/lib/vocabulary'
import { saveQuizResult, updateWordConfidence } from '@/lib/storage'
import { Word, QuizQuestion } from '@/lib/types'
import { Brain, CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react'

const QUIZ_LENGTH = 10

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizComplete, setQuizComplete] = useState(false)
  const [mounted, setMounted] = useState(false)

  const generateQuiz = useCallback(() => {
    const allWords = getAllWords()
    const quizWords = getRandomWords(QUIZ_LENGTH)
    
    const quizQuestions: QuizQuestion[] = quizWords.map(word => {
      // Get 3 wrong answers (different definitions)
      const otherWords = allWords.filter(w => w.id !== word.id)
      const wrongAnswers = getRandomWords(3, [word.id]).map(w => w.definition)
      
      // Combine and shuffle options
      const options = [word.definition, ...wrongAnswers].sort(() => Math.random() - 0.5)
      
      return {
        word,
        options,
        correctAnswer: word.definition,
      }
    })
    
    setQuestions(quizQuestions)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setQuizComplete(false)
  }, [])

  useEffect(() => {
    setMounted(true)
    generateQuiz()
  }, [generateQuiz])

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer
    setShowResult(true)
    setAnswers([...answers, isCorrect])
    
    if (isCorrect) {
      setScore(score + 1)
      updateWordConfidence(questions[currentQuestion].word.id, true)
    } else {
      updateWordConfidence(questions[currentQuestion].word.id, false)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // Quiz complete
      setQuizComplete(true)
      saveQuizResult({
        date: new Date().toISOString(),
        score: score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0),
        totalQuestions: QUIZ_LENGTH,
        wordsTested: questions.map(q => q.word.id),
      })
    }
  }

  if (!mounted || questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (quizComplete) {
    const finalScore = answers.filter(Boolean).length
    const percentage = (finalScore / QUIZ_LENGTH) * 100
    
    let message = ''
    let emoji = ''
    if (percentage >= 90) {
      message = 'Outstanding! You\'re a vocabulary master!'
      emoji = '🏆'
    } else if (percentage >= 70) {
      message = 'Great job! Keep up the excellent work!'
      emoji = '🌟'
    } else if (percentage >= 50) {
      message = 'Good effort! Practice makes perfect!'
      emoji = '💪'
    } else {
      message = 'Keep learning! You\'ll improve with practice!'
      emoji = '📚'
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-800/50 text-center animate-fade-in">
          <div className="text-6xl mb-6">{emoji}</div>
          
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Complete!
          </h2>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-8 h-8 text-accent-500" />
            <span className="text-5xl font-bold gradient-text">
              {finalScore}/{QUIZ_LENGTH}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            {message}
          </p>

          {/* Results breakdown */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {finalScore}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Correct</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                    {QUIZ_LENGTH - finalScore}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Incorrect</p>
              </div>
            </div>
          </div>

          {/* Words reviewed */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Words Reviewed
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {questions.map((q, i) => (
                <span
                  key={q.word.id}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    answers[i]
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {q.word.word}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={generateQuiz}
            className="flex items-center justify-center gap-2 w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Take Another Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Vocabulary Quiz
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Test your knowledge
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {score}/{currentQuestion + (showResult ? 1 : 0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-4 border border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-1">
            {answers.map((correct, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  correct ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            ))}
            {Array(questions.length - answers.length).fill(0).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        {/* Question Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-white/80" />
            <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white`}>
              {currentQ.word.level}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            {currentQ.word.word}
          </h2>
          <p className="text-white/80 mt-2 italic">{currentQ.word.partOfSpeech}</p>
        </div>

        {/* Options */}
        <div className="p-6 md:p-8 space-y-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Select the correct definition:
          </p>
          
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentQ.correctAnswer
            
            let optionStyle = 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            
            if (showResult) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-500'
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-50 dark:bg-rose-900/20 border-rose-500 dark:border-rose-500'
              }
            } else if (isSelected) {
              optionStyle = 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-500'
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${optionStyle} ${
                  !showResult ? 'cursor-pointer quiz-option' : 'cursor-default'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    showResult && isCorrect
                      ? 'bg-emerald-500 text-white'
                      : showResult && isSelected && !isCorrect
                      ? 'bg-rose-500 text-white'
                      : isSelected
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1">
                    {option}
                  </span>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Action Button */}
        <div className="px-6 md:px-8 pb-6 md:pb-8">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`w-full py-4 rounded-xl font-semibold transition-all ${
                selectedAnswer
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  See Results
                  <Trophy className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

