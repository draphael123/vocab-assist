# Vocab Assist - Word Upgrader

A vocabulary upgrade tool that helps you write with more sophisticated words. Includes a web app and Chrome extension.

## 🌐 Live Website

**[vocab-assist.vercel.app](https://website-ten-navy-tv0whkwmm8.vercel.app)**

## Features

### Website
- **Word Upgrader**: Paste text, select words, get sophisticated alternatives
- **Quick Search**: Type any common word to find better alternatives
- **Word Library**: Browse 200+ vocabulary words with definitions and examples
- **Word of the Day**: Daily featured vocabulary word

### Chrome Extension
- **Inline Suggestions**: Select any word while writing to see alternatives
- **Keyboard Shortcut**: `Ctrl+Shift+U` (or `Cmd+Shift+U` on Mac)
- **Right-Click Menu**: Upgrade Word option in context menu
- **Popup Search**: Quick word lookup from toolbar

## Getting Started

### Website

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Chrome Extension

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. Done! Select any word and press `Ctrl+Shift+U`

## Project Structure

```
vocab-assist/
├── shared/
│   └── vocabulary.json       # 200+ words database
├── website/                  # Next.js app
│   └── src/
│       ├── app/             # Pages
│       ├── components/      # React components
│       └── lib/             # Utilities
└── chrome-extension/        # Chrome extension
    ├── manifest.json
    ├── content.js           # Inline word upgrader
    ├── popup.html           # Extension popup
    └── vocabulary.js        # Synonym database
```

## Word Coverage

The tool includes sophisticated alternatives for 50+ common words:

| Basic Word | Better Alternatives |
|------------|---------------------|
| good | excellent, outstanding, exceptional, superior |
| bad | poor, inadequate, substandard, inferior |
| big | substantial, considerable, significant, extensive |
| important | crucial, essential, vital, paramount |
| difficult | challenging, demanding, arduous, formidable |
| help | assist, facilitate, support, enable |
| use | utilize, employ, leverage, harness |
| show | demonstrate, illustrate, reveal, exhibit |
| make | create, develop, establish, construct |
| think | consider, contemplate, evaluate, assess |

## Tech Stack

- **Website**: Next.js 14, TypeScript, Tailwind CSS
- **Extension**: Chrome Extension Manifest V3

## License

MIT
