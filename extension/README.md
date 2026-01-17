# Vocabulary Builder - VS Code Extension

Expand your vocabulary while coding! This extension provides vocabulary learning tools right in your editor.

## Features

### 📖 Word of the Day
See today's vocabulary word in the status bar. Click to view the full definition, example, and synonyms.

### 🔄 Synonym Lookup (Cmd+Shift+V / Ctrl+Shift+V)
1. Select any word in your code or text
2. Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows/Linux)
3. Choose a more sophisticated synonym from the list
4. The word is automatically replaced!

Works great for upgrading common words like:
- "big" → substantial, considerable, significant
- "good" → excellent, outstanding, exceptional
- "use" → utilize, employ, leverage
- And many more!

### 📝 Personal Word List
- Right-click any word and select "Add Word to Personal List"
- View your saved words with "Vocabulary: Show Personal Word List"
- Add notes to remember context

### ⚡ Quick Quiz
Take a 5-question vocabulary quiz without leaving your editor:
1. Open Command Palette (Cmd+Shift+P)
2. Run "Vocabulary: Quick Quiz"
3. Select the correct definition for each word
4. See your score at the end!

### 💡 Hover Definitions
Hover over any vocabulary word in your code to see its definition, example, and synonyms in a tooltip.

## Commands

| Command | Description |
|---------|-------------|
| `Vocabulary: Show Word of the Day` | Display today's word in a panel |
| `Vocabulary: Look Up Synonyms` | Find synonyms for selected text |
| `Vocabulary: Add Word to Personal List` | Save selected word |
| `Vocabulary: Show Personal Word List` | View saved words |
| `Vocabulary: Quick Quiz` | Start a 5-question quiz |
| `Vocabulary: Search Word` | Search the vocabulary database |

## Keyboard Shortcuts

| Shortcut | Command |
|----------|---------|
| `Cmd+Shift+V` / `Ctrl+Shift+V` | Look up synonyms for selection |

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `vocabularyBuilder.showStatusBar` | `true` | Show Word of the Day in status bar |
| `vocabularyBuilder.enableHoverDefinitions` | `true` | Show definitions on hover |

## Installation

### From Source
1. Clone the repository
2. Run `npm install` in the extension directory
3. Run `npm run compile`
4. Press F5 to launch Extension Development Host

### From VSIX
1. Download the `.vsix` file
2. In VS Code: Extensions → ... → Install from VSIX

## Vocabulary Database

This extension uses a shared vocabulary database with 200+ curated words across:
- **General** vocabulary for everyday use
- **Technical** terms for developers
- **Business** vocabulary for professionals
- **Academic** words for writing

Each word includes:
- Definition
- Part of speech
- Example sentence
- Synonyms and antonyms
- Difficulty level

## Tips

1. **Upgrade Your Code Comments**: Select generic words in comments and upgrade them with synonyms
2. **Learn While You Work**: Keep an eye on the status bar for daily vocabulary
3. **Build Your List**: Save words you want to remember to your personal list
4. **Quiz Yourself**: Take quick quizzes during breaks to reinforce learning

## Contributing

Found a word that should be added? Have an idea for a feature? Contributions are welcome!

## License

MIT

