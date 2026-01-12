import type { FC } from 'react';

export type CommandBarProps = {
  instruction: string;
  onInstructionChange: (next: string) => void;
  onSubmit: () => void;
  onUndo: () => void;
};

export const CommandBar: FC<CommandBarProps> = ({
  instruction,
  onInstructionChange,
  onSubmit,
  onUndo,
}) => {
  return (
    <div className="vibe-command-bar">
      <input
        value={instruction}
        placeholder="指示を入力"
        onChange={(event) => onInstructionChange(event.target.value)}
      />
      <button type="button" onClick={onSubmit}>
        生成
      </button>
      <button type="button" onClick={onUndo}>
        Undo
      </button>
    </div>
  );
};
