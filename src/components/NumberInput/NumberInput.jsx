import React from 'react';
import { cn } from '@/utils';
import { Label } from '@/components';

import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * NumberInput — Komponen input angka dengan unit (suffix) dan label kustom.
 * 
 * @param {string} label - Label teks di atas input.
 * @param {string} unit - Unit satuan (misal: cm, mm, pcs).
 * @param {string} className - Class tambahan untuk container luar.
 * @param {string} inputClassName - Class tambahan untuk elemen input.
 * @param {object} props - Prop input lainnya (value, onChange, min, max, dll).
 */
const NumberInput = ({
  label,
  unit = 'cm',
  className = '',
  inputClassName = '',
  onChange,
  value,
  ...props
}) => {
  const handleIncrement = () => {
    const currentValue = Number(value) || 0;
    if (onChange) {
      onChange({ target: { value: currentValue + 1 } });
    }
  };

  const handleDecrement = () => {
    const currentValue = Number(value) || 0;
    if (onChange) {
      onChange({ target: { value: Math.max(0, currentValue - 1) } });
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label className="text-color-secondary font-bold text-base md:text-lg">
          {label}
        </Label>
      )}
      
      <div className="flex w-full max-w-[220px] h-[45px] md:h-[50px] rounded-[10px] border-2 border-color-secondary bg-white overflow-hidden focus-within:ring-2 focus-within:ring-color-secondary/20 transition-all items-center">
        <input
          type="number"
          value={value}
          onChange={onChange}
          className={cn(
            "w-0 flex-1 bg-transparent px-4 text-center text-color-primary font-bold text-lg md:text-xl outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            inputClassName
          )}
          {...props}
        />

        {/* Custom Arrows */}
        <div className="flex flex-col justify-center px-1 border-r-2 border-transparent">
          <button 
            type="button" 
            onClick={handleIncrement}
            className="text-black hover:text-color-secondary transition-colors leading-none p-0"
          >
            <ChevronUp size={16} strokeWidth={3} />
          </button>
          <button 
            type="button" 
            onClick={handleDecrement}
            className="text-black hover:text-color-secondary transition-colors leading-none p-0"
          >
            <ChevronDown size={16} strokeWidth={3} />
          </button>
        </div>
        
        {/* Unit Suffix */}
        <div className="w-[50px] md:w-[60px] h-full bg-color-secondary flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0">
          {unit}
        </div>
      </div>
    </div>
  );
};

export default NumberInput;
