'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Chrome, Download, CheckCircle2, Copy, Check,
  Folder, Settings, Puzzle, MousePointer, Keyboard,
  Sparkles, ArrowRight, Github
} from 'lucide-react'

export default function ExtensionPage() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const steps = [
    {
      icon: Github,
      title: 'Download the Extension',
      description: 'Get the extension files from GitHub',
      action: (
        <a
          href="https://github.com/draphael123/vocab-assist/archive/refs/heads/main.zip"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download ZIP
        </a>
      ),
      details: 'After downloading, extract the ZIP file to a folder on your computer.'
    },
    {
      icon: Chrome,
      title: 'Open Chrome Extensions',
      description: 'Navigate to the extensions page',
      action: (
        <button
          onClick={() => copyToClipboard('chrome://extensions', 1)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-mono text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {copiedStep === 1 ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          chrome://extensions
        </button>
      ),
      details: 'Copy this URL and paste it in your Chrome address bar, then press Enter.'
    },
    {
      icon: Settings,
      title: 'Enable Developer Mode',
      description: 'Toggle the switch in the top right corner',
      action: (
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <span className="text-sm text-gray-600 dark:text-gray-400">Developer mode</span>
          <div className="w-12 h-6 bg-primary-500 rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
      ),
      details: 'This enables you to load extensions that aren\'t from the Chrome Web Store.'
    },
    {
      icon: Folder,
      title: 'Load Unpacked Extension',
      description: 'Click "Load unpacked" button',
      action: (
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium">
          <Puzzle className="w-5 h-5" />
          Load unpacked
        </div>
      ),
      details: 'Navigate to the extracted folder and select the "chrome-extension" subfolder.'
    },
    {
      icon: CheckCircle2,
      title: 'You\'re All Set!',
      description: 'The extension is now installed',
      action: (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl">
          <Sparkles className="w-5 h-5" />
          Extension Active
        </div>
      ),
      details: 'You\'ll see the ✨ icon in your browser toolbar. Click it to start upgrading words!'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <section className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Chrome className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Get the Chrome Extension
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Upgrade your vocabulary directly while typing in Gmail, Google Docs, LinkedIn, 
          and everywhere else. Follow the simple steps below to install.
        </p>
      </section>

      {/* Installation Steps */}
      <section className="space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div
              key={index}
              className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {step.description}
                  </p>
                  <div className="mb-3">
                    {step.action}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {step.details}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* Features */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-3xl p-8 border border-primary-100 dark:border-primary-800/50">
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          What You Get
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <MousePointer className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Click to Upgrade</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select any word and click the floating ✨ button
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Keyboard className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Keyboard Shortcut</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Press Ctrl+Shift+U to instantly upgrade
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Settings className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Tone Selection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Switch between formal and casual styles
            </p>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Word Upgrader
        </Link>
      </div>
    </div>
  )
}

