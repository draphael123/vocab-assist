import * as vscode from 'vscode';

export interface SavedWord {
  word: string;
  definition?: string;
  addedAt: string;
  notes?: string;
}

const STORAGE_KEY = 'vocabularyBuilder.wordList';

export class WordListManager {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  getWordList(): SavedWord[] {
    return this.context.globalState.get<SavedWord[]>(STORAGE_KEY, []);
  }

  addWord(word: string, definition?: string): boolean {
    const list = this.getWordList();
    
    // Check if word already exists
    if (list.some(w => w.word.toLowerCase() === word.toLowerCase())) {
      return false;
    }

    list.push({
      word,
      definition,
      addedAt: new Date().toISOString(),
    });

    this.context.globalState.update(STORAGE_KEY, list);
    return true;
  }

  removeWord(word: string): boolean {
    const list = this.getWordList();
    const index = list.findIndex(w => w.word.toLowerCase() === word.toLowerCase());
    
    if (index === -1) {
      return false;
    }

    list.splice(index, 1);
    this.context.globalState.update(STORAGE_KEY, list);
    return true;
  }

  hasWord(word: string): boolean {
    const list = this.getWordList();
    return list.some(w => w.word.toLowerCase() === word.toLowerCase());
  }

  updateNotes(word: string, notes: string): boolean {
    const list = this.getWordList();
    const item = list.find(w => w.word.toLowerCase() === word.toLowerCase());
    
    if (!item) {
      return false;
    }

    item.notes = notes;
    this.context.globalState.update(STORAGE_KEY, list);
    return true;
  }

  clearList(): void {
    this.context.globalState.update(STORAGE_KEY, []);
  }
}

