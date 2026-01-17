# Vocab Assist - Chrome Extension

A powerful Chrome extension that helps you upgrade your vocabulary while you write. Transform basic words into sophisticated alternatives with one click.

## Features

### ✨ Word Upgrading
- Select any word and get instant synonym suggestions
- Click to replace with sophisticated alternatives
- Supports 70+ common words with multiple synonyms each

### 🎨 Tone Selection
- **Formal**: Professional and polished vocabulary
- **Casual**: Friendly and conversational alternatives
- Switch between tones in real-time

### 🎯 Smart Detection
- Floating sparkle button appears when you select upgradeable words
- Auto-highlights weak words in contenteditable fields
- Works on all websites

### ⌨️ Keyboard Shortcut
- Press `Ctrl+Shift+U` (or `Cmd+Shift+U` on Mac) to upgrade selected word
- `Escape` to close popup

### ↩️ Undo Support
- One-click undo for the last replacement
- `Ctrl+Z` while popup is open also works

### 📊 Statistics
- Track how many words you've upgraded
- Session counter
- Persistent stats across browser sessions

### ⚙️ Customizable Settings
- Toggle floating button on/off
- Enable/disable auto-highlighting
- Settings sync across sessions

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `chrome-extension` folder

### Usage

1. **Quick Popup**: Click the extension icon in your toolbar
2. **While Writing**: 
   - Select a word in any text field
   - Click the floating ✨ button that appears
   - Or press `Ctrl+Shift+U`
3. **Right-Click Menu**: Select text → Right-click → "Upgrade word"

## Supported Words

The extension supports 70+ common words including:

- **Basic**: good, bad, big, small, fast, slow
- **Filler words**: very, really, just, basically, actually
- **Actions**: use, make, change, fix, help, show, get, think
- **Descriptors**: important, difficult, easy, new, old
- **And many more!**

## Privacy

- All processing happens locally in your browser
- No data is sent to external servers
- Statistics are stored in local Chrome storage only

## Development

```bash
# The extension is built with vanilla JavaScript
# No build step required

# To test changes:
1. Make your changes to the source files
2. Go to chrome://extensions
3. Click the refresh button on the extension card
```

## Files

- `manifest.json` - Extension configuration
- `popup.html/js` - Extension popup interface
- `content.js/css` - Content script for in-page functionality
- `background.js` - Service worker for context menu and commands
- `icons/` - Extension icons

## Website

For a full-featured text upgrading experience, visit our companion website:
[Vocab Assist Website](https://website-ten-navy-tv0whkwmm8.vercel.app)

## License

MIT License - Feel free to modify and distribute.
