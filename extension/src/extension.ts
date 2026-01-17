import * as vscode from 'vscode';
import {
  getWordOfTheDay,
  getSynonymsForWord,
  searchWords,
  getAllWords,
  findWordExact,
  getRandomWords,
  getLevelEmoji,
  getCategoryEmoji,
  Word
} from './vocabulary';
import { WordListManager } from './wordListManager';

let statusBarItem: vscode.StatusBarItem;
let wordListManager: WordListManager;

export function activate(context: vscode.ExtensionContext) {
  console.log('Vocabulary Builder extension is now active!');

  wordListManager = new WordListManager(context);

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'vocabularyBuilder.showWordOfTheDay';
  context.subscriptions.push(statusBarItem);

  // Update status bar with Word of the Day
  updateStatusBar(context);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('vocabularyBuilder.showWordOfTheDay', () => {
      showWordOfTheDay(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vocabularyBuilder.lookupSynonyms', () => {
      lookupSynonyms(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vocabularyBuilder.addToWordList', () => {
      addToWordList(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vocabularyBuilder.showWordList', () => {
      showWordList(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vocabularyBuilder.quickQuiz', () => {
      quickQuiz(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vocabularyBuilder.searchWord', () => {
      searchWord(context);
    })
  );

  // Register hover provider for vocabulary words
  const config = vscode.workspace.getConfiguration('vocabularyBuilder');
  if (config.get('enableHoverDefinitions', true)) {
    const hoverProvider = vscode.languages.registerHoverProvider(
      { scheme: '*', language: '*' },
      {
        provideHover(document, position) {
          const range = document.getWordRangeAtPosition(position);
          if (!range) return null;

          const word = document.getText(range);
          const vocabWord = findWordExact(context.extensionPath, word);
          
          if (vocabWord) {
            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`### ${vocabWord.word} ${getLevelEmoji(vocabWord.level)}\n\n`);
            markdown.appendMarkdown(`*${vocabWord.partOfSpeech}*\n\n`);
            markdown.appendMarkdown(`${vocabWord.definition}\n\n`);
            markdown.appendMarkdown(`---\n\n`);
            markdown.appendMarkdown(`**Example:** "${vocabWord.example}"\n\n`);
            if (vocabWord.synonyms.length > 0) {
              markdown.appendMarkdown(`**Synonyms:** ${vocabWord.synonyms.join(', ')}`);
            }
            return new vscode.Hover(markdown);
          }
          
          return null;
        }
      }
    );
    context.subscriptions.push(hoverProvider);
  }
}

function updateStatusBar(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('vocabularyBuilder');
  if (!config.get('showStatusBar', true)) {
    statusBarItem.hide();
    return;
  }

  const word = getWordOfTheDay(context.extensionPath);
  if (word) {
    statusBarItem.text = `$(book) ${word.word}`;
    statusBarItem.tooltip = `Word of the Day: ${word.word}\n${word.definition}\n\nClick to see more`;
    statusBarItem.show();
  }
}

async function showWordOfTheDay(context: vscode.ExtensionContext) {
  const word = getWordOfTheDay(context.extensionPath);
  if (!word) {
    vscode.window.showInformationMessage('Could not load Word of the Day');
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    'wordOfTheDay',
    `Word of the Day: ${word.word}`,
    vscode.ViewColumn.Beside,
    { enableScripts: true }
  );

  panel.webview.html = getWordDetailHtml(word);
}

function getWordDetailHtml(word: Word): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
          line-height: 1.6;
          color: var(--vscode-foreground);
          background: var(--vscode-editor-background);
        }
        .header {
          margin-bottom: 20px;
        }
        h1 {
          margin: 0 0 8px 0;
          font-size: 2em;
          color: var(--vscode-textLink-foreground);
        }
        .meta {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
        }
        .badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85em;
          font-weight: 500;
        }
        .level-beginner { background: #10b981; color: white; }
        .level-intermediate { background: #3b82f6; color: white; }
        .level-advanced { background: #8b5cf6; color: white; }
        .level-expert { background: #ef4444; color: white; }
        .pos {
          font-style: italic;
          color: var(--vscode-descriptionForeground);
        }
        .definition {
          font-size: 1.1em;
          margin-bottom: 20px;
        }
        .example {
          background: var(--vscode-textBlockQuote-background);
          border-left: 4px solid var(--vscode-textLink-foreground);
          padding: 12px 16px;
          margin: 20px 0;
          font-style: italic;
        }
        .section {
          margin: 20px 0;
        }
        .section-title {
          font-size: 0.9em;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--vscode-descriptionForeground);
          margin-bottom: 8px;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag {
          padding: 4px 10px;
          background: var(--vscode-badge-background);
          color: var(--vscode-badge-foreground);
          border-radius: 4px;
          font-size: 0.9em;
        }
        .tag.antonym {
          background: var(--vscode-inputValidation-errorBackground);
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${word.word}</h1>
        <div class="meta">
          <span class="pos">${word.partOfSpeech}</span>
          <span class="badge level-${word.level}">${word.level}</span>
          <span>${getCategoryEmoji(word.category)} ${word.category}</span>
        </div>
      </div>
      
      <p class="definition">${word.definition}</p>
      
      <div class="example">"${word.example}"</div>
      
      ${word.synonyms.length > 0 ? `
        <div class="section">
          <div class="section-title">Synonyms</div>
          <div class="tags">
            ${word.synonyms.map(s => `<span class="tag">${s}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      
      ${word.antonyms.length > 0 ? `
        <div class="section">
          <div class="section-title">Antonyms</div>
          <div class="tags">
            ${word.antonyms.map(a => `<span class="tag antonym">${a}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;
}

async function lookupSynonyms(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('No active editor');
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection).trim();
  
  if (!selectedText) {
    vscode.window.showInformationMessage('Please select a word first');
    return;
  }

  // Get synonyms
  const synonyms = getSynonymsForWord(context.extensionPath, selectedText);
  
  if (synonyms.length === 0) {
    // Check if it's a vocabulary word
    const vocabWord = findWordExact(context.extensionPath, selectedText);
    if (vocabWord) {
      vscode.window.showInformationMessage(
        `"${selectedText}" has no synonyms in our database, but it means: ${vocabWord.definition}`
      );
    } else {
      vscode.window.showInformationMessage(
        `No synonyms found for "${selectedText}"`
      );
    }
    return;
  }

  // Show quick pick with synonyms
  const items = synonyms.map(syn => ({
    label: syn,
    description: `Replace "${selectedText}" with "${syn}"`
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: `Select a synonym for "${selectedText}"`,
    title: 'Synonym Lookup'
  });

  if (selected) {
    await editor.edit(editBuilder => {
      editBuilder.replace(selection, selected.label);
    });
    vscode.window.showInformationMessage(`Replaced "${selectedText}" with "${selected.label}"`);
  }
}

async function addToWordList(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;
  let wordToAdd: string | undefined;

  if (editor) {
    const selection = editor.selection;
    wordToAdd = editor.document.getText(selection).trim();
  }

  if (!wordToAdd) {
    wordToAdd = await vscode.window.showInputBox({
      prompt: 'Enter a word to add to your personal list',
      placeHolder: 'Word'
    });
  }

  if (!wordToAdd) return;

  // Check if it's a vocabulary word to get definition
  const vocabWord = findWordExact(context.extensionPath, wordToAdd);
  const definition = vocabWord?.definition;

  const added = wordListManager.addWord(wordToAdd, definition);
  
  if (added) {
    vscode.window.showInformationMessage(`Added "${wordToAdd}" to your word list`);
  } else {
    vscode.window.showInformationMessage(`"${wordToAdd}" is already in your word list`);
  }
}

async function showWordList(context: vscode.ExtensionContext) {
  const list = wordListManager.getWordList();

  if (list.length === 0) {
    vscode.window.showInformationMessage('Your word list is empty. Select text and use "Add to Word List" to save words.');
    return;
  }

  const items = list.map(item => ({
    label: item.word,
    description: item.definition || 'No definition',
    detail: `Added: ${new Date(item.addedAt).toLocaleDateString()}${item.notes ? ` | Notes: ${item.notes}` : ''}`,
    word: item
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a word to view options',
    title: `Your Word List (${list.length} words)`
  });

  if (selected) {
    const action = await vscode.window.showQuickPick([
      { label: '$(search) Look up synonyms', action: 'synonyms' },
      { label: '$(note) Add/edit notes', action: 'notes' },
      { label: '$(trash) Remove from list', action: 'remove' }
    ], {
      placeHolder: `Options for "${selected.label}"`
    });

    if (action?.action === 'synonyms') {
      const synonyms = getSynonymsForWord(context.extensionPath, selected.label);
      if (synonyms.length > 0) {
        vscode.window.showInformationMessage(`Synonyms for ${selected.label}: ${synonyms.join(', ')}`);
      } else {
        vscode.window.showInformationMessage(`No synonyms found for "${selected.label}"`);
      }
    } else if (action?.action === 'notes') {
      const notes = await vscode.window.showInputBox({
        prompt: `Add notes for "${selected.label}"`,
        value: selected.word.notes || ''
      });
      if (notes !== undefined) {
        wordListManager.updateNotes(selected.label, notes);
        vscode.window.showInformationMessage('Notes updated');
      }
    } else if (action?.action === 'remove') {
      wordListManager.removeWord(selected.label);
      vscode.window.showInformationMessage(`Removed "${selected.label}" from your list`);
    }
  }
}

async function quickQuiz(context: vscode.ExtensionContext) {
  const words = getRandomWords(context.extensionPath, 5);
  
  if (words.length < 5) {
    vscode.window.showInformationMessage('Not enough words loaded for a quiz');
    return;
  }

  let score = 0;
  const totalQuestions = 5;

  for (let i = 0; i < totalQuestions; i++) {
    const questionWord = words[i];
    const otherWords = getRandomWords(context.extensionPath, 3, [questionWord.id]);
    
    // Create options
    const options = [
      { label: questionWord.definition, isCorrect: true },
      ...otherWords.map(w => ({ label: w.definition, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);

    const selected = await vscode.window.showQuickPick(
      options.map(o => o.label),
      {
        placeHolder: `Question ${i + 1}/${totalQuestions}: What does "${questionWord.word}" mean?`,
        title: `Vocabulary Quiz (Score: ${score}/${i})`
      }
    );

    if (selected === undefined) {
      // User cancelled
      vscode.window.showInformationMessage(`Quiz cancelled. Final score: ${score}/${i}`);
      return;
    }

    const isCorrect = options.find(o => o.label === selected)?.isCorrect;
    
    if (isCorrect) {
      score++;
      await vscode.window.showInformationMessage(`✅ Correct! "${questionWord.word}" means: ${questionWord.definition}`);
    } else {
      await vscode.window.showInformationMessage(`❌ Incorrect. "${questionWord.word}" means: ${questionWord.definition}`);
    }
  }

  // Show final score
  const percentage = (score / totalQuestions) * 100;
  let message = `Quiz complete! Score: ${score}/${totalQuestions} (${percentage}%)`;
  
  if (percentage >= 80) {
    message += ' 🏆 Excellent!';
  } else if (percentage >= 60) {
    message += ' 👍 Good job!';
  } else {
    message += ' 📚 Keep practicing!';
  }

  vscode.window.showInformationMessage(message);
}

async function searchWord(context: vscode.ExtensionContext) {
  const query = await vscode.window.showInputBox({
    prompt: 'Search for a word',
    placeHolder: 'Enter a word or part of a definition'
  });

  if (!query) return;

  const results = searchWords(context.extensionPath, query);

  if (results.length === 0) {
    vscode.window.showInformationMessage(`No words found matching "${query}"`);
    return;
  }

  const items = results.slice(0, 20).map(word => ({
    label: `${word.word} ${getLevelEmoji(word.level)}`,
    description: word.partOfSpeech,
    detail: word.definition,
    word
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: `Found ${results.length} words matching "${query}"`,
    title: 'Search Results'
  });

  if (selected) {
    const panel = vscode.window.createWebviewPanel(
      'wordDetail',
      selected.word.word,
      vscode.ViewColumn.Beside,
      { enableScripts: true }
    );
    panel.webview.html = getWordDetailHtml(selected.word);
  }
}

export function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}

