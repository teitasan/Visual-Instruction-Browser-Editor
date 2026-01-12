// Application state container for VIBE MVP.

export type VibeditorNodeId = string;

export interface CommandHistoryEntry {
  timestamp: number;
  userInstruction: string;
  beforeHtml: string;
  afterHtml: string;
}

export interface AppState {
  sourceFullHtml: string;
  targetOuterHtmls: string[];
  selectionIds: VibeditorNodeId[];
  commandHistory: CommandHistoryEntry[];
}

export const createInitialState = (): AppState => ({
  sourceFullHtml: '',
  targetOuterHtmls: [],
  selectionIds: [],
  commandHistory: [],
});
