import type { Metadata } from 'next'
import { Outfit, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import ThemeProvider from '@/components/ThemeProvider'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lexicon - Vocabulary Builder',
  description: 'Expand your vocabulary with flashcards, quizzes, and spaced repetition learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} font-sans antialiased bg-pattern min-h-screen`}>
        <ThemeProvider>
          <Navigation />
          <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

