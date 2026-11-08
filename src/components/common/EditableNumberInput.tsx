import React, { useState, useEffect } from 'react';

export interface EditableNumberInputProps {
  value: number;
  onChange: (val: number) => void;
  className?: string;
  min?: number;
  max?: number;
  ariaLabel?: string;
  title?: string;
}

export const EditableNumberInput: React.FC<EditableNumberInputProps> = ({
  value,
  onChange,
  className = '',
  min = 0,
  max,
  ariaLabel,
  title,
}) => {
  const [localVal, setLocalVal] = useState<string>(String(value));
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalVal(String(value));
    }
  }, [value, isFocused]);

  const commitValue = (valStr: string) => {
    let parsed = parseInt(valStr, 10);
    if (isNaN(parsed) || parsed < min) {
      parsed = min;
    }
    if (max !== undefined && parsed > max) {
      parsed = max;
    }
    setLocalVal(String(parsed));
    if (parsed !== value) {
      onChange(parsed);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalVal(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= min && (max === undefined || parsed <= max)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    commitValue(localVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitValue(localVal);
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const current = parseInt(localVal, 10) || 0;
      const next = max !== undefined ? Math.min(max, current + 1) : current + 1;
      setLocalVal(String(next));
      onChange(next);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const current = parseInt(localVal, 10) || 0;
      const next = Math.max(min, current - 1);
      setLocalVal(String(next));
      onChange(next);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={localVal}
      onFocus={() => setIsFocused(true)}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      title={title}
      className={`focus:outline-none transition-all selection:bg-amber-500/30 ${className}`}
    />
  );
};
