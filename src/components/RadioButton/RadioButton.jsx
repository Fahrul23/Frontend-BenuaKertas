import React from 'react';
import { cn } from '@/utils';

/**
 * RadioButton - Komponen radio button custom dengan styling pill/rounded
 * 
 * Specs:
 * - Outer circle: 22px x 22px
 * - Inner dot: 17px x 17px (when checked)
 * - Border: border-2 color-secondary
 * - Padding: px-2 py-2
 * - Active: bg-color-light
 * - Inactive: bg-white
 * 
 * @param {string} label - Label untuk radio button
 * @param {string} value - Value dari radio button
 * @param {string} name - Name group untuk radio button
 * @param {boolean} checked - Status checked
 * @param {function} onChange - Handler saat value berubah
 * @param {string} className - Class tambahan untuk container
 * @param {boolean} disabled - Status disabled
 */
const RadioButton = ({
  label,
  value,
  name,
  checked = false,
  onChange,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <label
      className={cn(
        "relative inline-flex items-center cursor-pointer transition-all duration-300",
        "min-w-[120px] px-2 py-2 rounded-full border-2",
        checked
          ? "bg-color-light border-color-secondary scale-105 shadow-sm"
          : "bg-white border-color-secondary hover:bg-color-light/50 hover:scale-105 hover:shadow-sm",
        disabled && "opacity-50 cursor-not-allowed hover:bg-white hover:scale-100 hover:shadow-none",
        className
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      
      {/* Custom Radio Circle Container - 22px x 22px */}
      <div className="relative w-[22px] h-[22px] mr-2.5 flex-shrink-0">
        {/* Outer Circle */}
        <div className={cn(
          "absolute inset-0 rounded-full border-2 bg-white transition-all duration-300",
          "border-color-secondary"
        )}>
          {/* Inner Dot - 17px x 17px - Only visible when checked */}
          {checked && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[17px] h-[17px] rounded-full bg-color-secondary transition-all duration-300 scale-100 animate-in zoom-in" />
          )}
        </div>
      </div>

      {/* Label */}
      {label && (
        <span className={cn(
          "text-sm font-semibold transition-colors duration-300 leading-[17px]",
          "text-color-secondary"
        )}>
          {label}
        </span>
      )}
    </label>
  );
};

export default RadioButton;
