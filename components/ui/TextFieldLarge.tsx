'use client';

interface TextFieldLargeProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function TextFieldLarge({ value, onChange, placeholder, maxLength = 200 }: TextFieldLargeProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full min-h-[44px] px-4 py-3 text-base font-body bg-transparent border-b-2 border-neutral/40 text-ink placeholder:text-neutral/60 focus:outline-none focus:border-andes transition-colors"
      />
      <div className="mt-1 text-right text-xs text-neutral font-body">
        {value.length}/{maxLength}
      </div>
    </div>
  );
}
