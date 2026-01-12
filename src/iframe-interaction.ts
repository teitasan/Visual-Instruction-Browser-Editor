// iframe interaction helpers for VIBE MVP.

export const VIBE_POST_MESSAGE_TYPE = 'vibe-editor';

export type VibeditorSelectionMessage = {
  type: typeof VIBE_POST_MESSAGE_TYPE;
  action: 'selection-changed';
  selectedIds: string[];
};

export const isVibeMessage = (payload: unknown): payload is VibeditorSelectionMessage => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    (payload as VibeditorSelectionMessage).type === VIBE_POST_MESSAGE_TYPE
  );
};
