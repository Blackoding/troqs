import React from 'react';

interface InputProps {
  icon?: React.ReactNode;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  isMultiline?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  type?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  required?: boolean;
  min?: string | number;
  step?: string | number;
  rows?: number;
}

const Input: React.FC<InputProps> = ({ icon, placeholder, label, isRequired, isMultiline, onChange, ...props }) => {
  return (
    <>
      {label && (
        <label className="text-sm font-bold text-black">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 w-full shadow-sm">
        {icon && <span className="mr-3 text-gray-400">{icon}</span>}
        {isMultiline ? (
          <textarea
            className="outline-none bg-transparent w-full text-xl text-black placeholder:text-gray-400"
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            value={props.value}
            name={props.name}
            id={props.id}
            rows={props.rows}
          />
        ) : (
          <input
            className="outline-none bg-transparent w-full text-xl text-black placeholder:text-gray-400"
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            value={props.value}
            type={props.type}
            name={props.name}
            id={props.id}
            autoComplete={props.autoComplete}
            required={props.required}
            min={props.min}
            step={props.step}
          />
        )}
      </div>
    </>
  );
};

export default Input;
