import React from 'react';

type InputProps = {
  label: string;
  id: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function FormInput({ label, id, required, className, ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <label htmlFor={id} className="text-base font-semibold text-slate-800 flex gap-1">
        {label} {required && <span className="text-amber-500">*</span>}
      </label>
      <input
        id={id}
        required={required}
        className="px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent shadow-sm transition-all placeholder:text-slate-400 hover:border-emerald-400"
        {...props}
      />
    </div>
  );
}

type SelectProps = {
  label: string;
  id: string;
  options: { label: string; value: string }[];
  placeholder?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function FormSelect({ label, id, required, options, className, placeholder, ...props }: SelectProps) {
  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <label htmlFor={id} className="text-base font-semibold text-slate-800 flex gap-1">
        {label} {required && <span className="text-amber-500">*</span>}
      </label>
      <select
        id={id}
        required={required}
        defaultValue=""
        className="px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent shadow-sm transition-all appearance-none cursor-pointer hover:border-emerald-400"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 1rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '3rem'
        }}
        {...props}
      >
        <option value="" disabled hidden>{placeholder || 'Pilih salah satu...'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

type TextareaProps = {
  label: string;
  id: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea({ label, id, required, className, ...props }: TextareaProps) {
  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <label htmlFor={id} className="text-base font-semibold text-slate-800 flex gap-1">
        {label} {required && <span className="text-amber-500">*</span>}
      </label>
      <textarea
        id={id}
        required={required}
        className="px-4 py-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent shadow-sm transition-all placeholder:text-slate-400 min-h-[120px] resize-y hover:border-emerald-400"
        {...props}
      />
    </div>
  );
}
