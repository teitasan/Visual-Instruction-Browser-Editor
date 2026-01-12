// iframe interaction helpers for VIBE MVP.

export const VIBE_POST_MESSAGE_TYPE = 'selected';

export type VibeditorSelectionTarget = {
  label: string;
  outerHTML: string;
  tagName: string;
};

export type VibeditorSelectionMessage = {
  type: typeof VIBE_POST_MESSAGE_TYPE;
  selectionType: 'single' | 'multi';
  targets: VibeditorSelectionTarget[];
};

export const isVibeMessage = (payload: unknown): payload is VibeditorSelectionMessage => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    (payload as VibeditorSelectionMessage).type === VIBE_POST_MESSAGE_TYPE
  );
};
