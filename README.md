# Lexicon - Vocabulary Builder

A comprehensive vocabulary learning application with two parts:
1. **Next.js Website** - Interactive flashcards, quizzes, and progress tracking
2. **VS Code/Cursor Extension** - Learn vocabulary while coding

![Vocabulary Builder](https://via.placeholder.com/800x400/6366f1/ffffff?text=Lexicon+Vocabulary+Builder)

## Features

### Website Features
- 📅 **Word of the Day** - Daily featured vocabulary word
- 🎴 **Flashcards** - Interactive flip cards with confidence tracking
- 🧠 **Quizzes** - Multiple choice questions with immediate feedback
- 🔍 **Browse** - Search and filter 200+ words by level and category
- 📊 **Progress Tracking** - Spaced repetition and learning statistics
- 🌙 **Dark Mode** - Beautiful dark and light themes

### Extension Features
- 📖 **Status Bar Word** - Word of the Day always visible
- 🔄 **Synonym Lookup** - Select text + Cmd+Shift+V to find synonyms and replace
- 📝 **Personal Word List** - Save words for later review
- ⚡ **Quick Quiz** - Take a 5-question quiz without leaving your editor
- 💡 **Hover Definitions** - See definitions when hovering over vocabulary words

## Getting Started

### Website

```bash
cd vocabulary-builder/website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Extension

1. Navigate to the extension directory:
```bash
cd vocabulary-builder/extension
npm install
npm run compile
```

2. Open the extension folder in VS Code/Cursor
3. Press F5 to launch the Extension Development Host
4. Use the commands from the Command Palette (Cmd+Shift+P):
   - "Vocabulary: Show Word of the Day"
   - "Vocabulary: Look Up Synonyms"
   - "Vocabulary: Quick Quiz"
   - And more...

## Project Structure

```
vocabulary-builder/
├── shared/
│   └── vocabulary.json      # 200+ words shared between website and extension
├── website/                 # Next.js 14 app
│   └── src/
│       ├── app/             # App Router pages
│       ├── components/      # React components
│       └── lib/             # Utilities and helpers
└── extension/               # VS Code extension
    └── src/
        ├── extension.ts     # Main extension entry
        ├── vocabulary.ts    # Vocabulary data loader
        └── wordListManager.ts # Personal word list storage
```

## Vocabulary Data

The vocabulary includes 200+ carefully curated words across:

**Levels:**
- 🟢 Beginner (20%) - Common professional vocabulary
- 🔵 Intermediate (35%) - Business and technical terms
- 🟣 Advanced (35%) - Sophisticated vocabulary
- 🔴 Expert (10%) - Specialized terminology

**Categories:**
- 📚 General (40%) - Everyday professional use
- 💻 Technical (20%) - Software and technology
- 💼 Business (20%) - Corporate and finance
- 🎓 Academic (20%) - Research and writing

## Spaced Repetition

The app uses a spaced repetition algorithm based on confidence levels:

| Confidence | Next Review |
|------------|-------------|
| 0-1        | 1 day       |
| 2          | 2 days      |
| 3          | 4 days      |
| 4          | 7 days      |
| 5          | 14 days     |

## Tech Stack

### Website
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide Icons
- localStorage for persistence

### Extension
- VS Code Extension API
- TypeScript
- Extension Storage API

## Screenshots

### Home Page
Beautiful hero section with Word of the Day and quick stats.

### Flashcards
Click to flip between word and definition with confidence buttons.

### Quiz
Multiple choice questions with immediate feedback and final score.

### Progress
Track your learning with detailed statistics and spaced repetition schedule.

## Contributing

Contributions are welcome! Feel free to add more words to `shared/vocabulary.json` or improve the UI/UX.

## License

MIT

