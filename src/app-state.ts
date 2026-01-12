// Application state container for VIBE MVP.

export type VibeditorLabel = string;

export interface SelectionTarget {
  label: VibeditorLabel;
  tagName?: string;
  outerHTML: string;
}

export interface SelectionInfo {
  type: 'single' | 'multi';
  targets: SelectionTarget[];
}

export interface AppState {
  currentSource: string;
  isProcessing: boolean;
  history: string[];
  selectionMode: 'click';
  selection: SelectionInfo | null;
  lastInstruction?: string;
}

export const createInitialState = (): AppState => ({
  currentSource: '',
  isProcessing: false,
  history: [],
  selectionMode: 'click',
  selection: null,
  lastInstruction: undefined,
});
