import type { FC } from 'react';

export type CommandBarProps = {
  instruction: string;
  statusText: string;
  targetSummary?: string;
  isProcessing: boolean;
  canUndo: boolean;
  onInstructionChange: (next: string) => void;
  onSubmit: () => void;
  onUndo: () => void;
};

export const CommandBar: FC<CommandBarProps> = ({
  instruction,
  statusText,
  targetSummary,
  isProcessing,
  canUndo,
  onInstructionChange,
  onSubmit,
  onUndo,
}) => {
  return (
    <div className="vibe-command-bar">
      <div className="vibe-command-status">
        <strong>{statusText}</strong>
        {targetSummary ? <span>{targetSummary}</span> : null}
      </div>
      <textarea
        value={instruction}
        placeholder="指示を入力"
        disabled={isProcessing}
        onChange={(event) => onInstructionChange(event.target.value)}
      />
      <div className="vibe-command-actions">
        <button type="button" onClick={onSubmit} disabled={isProcessing}>
          実行
        </button>
        <button type="button" onClick={onUndo} disabled={!canUndo || isProcessing}>
          Undo
        </button>
      </div>
    </div>
  );
};
