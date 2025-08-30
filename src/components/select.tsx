'use client'

import React from 'react';

interface SelectProps {
  icon?: React.ReactNode;
  placeholder?: string;
  options: { value: string; label: string }[];
  label?: string;
  isRequired?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  name?: string;
  id?: string;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({ icon, placeholder, options, label, isRequired, onChange, ...props }) => {
  return (
    <>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full focus-within:ring-[#0019FF] focus-within:border-[#0019FF] focus-within:outline-none focus-within:ring-2">
        {icon && <span className="mr-3 text-gray-400">{icon}</span>}
        <select
          className="outline-none bg-transparent w-full text-black dark:text-white appearance-none"
          value={props.value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          name={props.name}
          id={props.id}
          required={props.required}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-black dark:text-white bg-white dark:bg-gray-700">
              {option.label}
            </option>
          ))}
        </select>
        {/* Ícone de seta para baixo */}
        <span className="ml-2 text-gray-400 pointer-events-none">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </>
  );
};

export default Select;