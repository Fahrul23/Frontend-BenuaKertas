import { NumberInput } from '@/components';
import { AlertCircle } from 'lucide-react';
import ukuranBoxImg from '@/assets/ukuran-box.svg';

const SizeStep = ({ sizes, onSizeChange, selectedModel, planoInfo = {}, pricingError }) => {
  const isTopBottomBox = selectedModel === 'top-bottom-box';
  const isEarlockSamping = selectedModel === 'earlock-box-samping';

  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-2">Ukuran Box</h2>
      </div>

      {/* Error Alert */}
      {pricingError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-800 mb-1">Ukuran Tidak Valid</h3>
            <p className="text-xs text-red-600 leading-relaxed">{pricingError}</p>
          </div>
        </div>
      )}

      {/* Size Inputs - Always 3 columns */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <NumberInput
          label="Panjang"
          unit="cm"
          value={sizes.panjang}
          onChange={(e) => onSizeChange('panjang', e.target.value)}
          min="0"
          placeholder="0"
        />
        <NumberInput
          label="Lebar"
          unit="cm"
          value={sizes.lebar}
          onChange={(e) => onSizeChange('lebar', e.target.value)}
          min="0"
          placeholder="0"
        />
        <NumberInput
          label="Tinggi"
          unit="cm"
          value={sizes.tinggi}
          onChange={(e) => onSizeChange('tinggi', e.target.value)}
          min="0"
          placeholder="0"
        />
        {/* Tinggi Tutup - Only for Top Bottom Box */}
        {isTopBottomBox && (
          <NumberInput
            label="Panjang Tutup"
            unit="cm"
            value={sizes.tinggiTutup || ''}
            onChange={(e) => onSizeChange('tinggiTutup', e.target.value)}
            min="0"
            placeholder="0"
          />
        )}
        {/* Lidah - Only for Earlock Box Samping */}
        {isEarlockSamping && (
          <NumberInput
            label="Panjang Lidah"
            unit="cm"
            value={sizes.lidah || ''}
            onChange={(e) => onSizeChange('lidah', e.target.value)}
            min="0"
            placeholder="0"
          />
        )}
      </div>

      {/* Box Image with Labels */}
      <div className="relative p-8 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          {/* Box Image */}
          <img
            src={ukuranBoxImg}
            alt="Box dimensions"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SizeStep;
