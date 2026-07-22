import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils';

/**
 * SelectInput - Komponen select/dropdown input dengan styling custom
 * Mirip dengan NumberInput tapi untuk dropdown selection
 * 
 * @param {string} label - Label untuk select input
 * @param {string} unit - Unit yang ditampilkan di sebelah kanan (contoh: "pcs", "cm")
 * @param {string} value - Value yang dipilih
 * @param {function} onChange - Handler saat value berubah
 * @param {array} options - Array of options [{value, label}]
 * @param {string} placeholder - Placeholder text
 * @param {string} className - Class tambahan untuk container
 * @param {boolean} disabled - Status disabled
 */
const SelectInput = ({
  label,
  unit,
  value,
  onChange,
  options = [],
  placeholder = 'Pilih...',
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {/* Label */}
      {label && (
        <label className="text-sm font-semibold text-color-black mb-2">
          {label}
        </label>
      )}

      {/* Select Container */}
      <div className="relative flex items-stretch">
        {/* Select Input */}
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 pr-12 border-2 rounded-l-lg transition-all duration-300 appearance-none cursor-pointer h-[52px]',
            'text-color-black font-semibold text-lg',
            'focus:outline-none focus:border-color-secondary',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            unit ? 'rounded-r-none border-r-0' : 'rounded-r-lg',
            value ? 'border-color-secondary' : 'border-gray-300'
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown size={20} className="text-color-secondary" />
        </div>

        {/* Unit Label */}
        {unit && (
          <div className="px-4 bg-color-secondary text-white font-bold text-sm rounded-r-lg border-2 border-color-secondary flex items-center justify-center min-w-[60px]">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInput;
