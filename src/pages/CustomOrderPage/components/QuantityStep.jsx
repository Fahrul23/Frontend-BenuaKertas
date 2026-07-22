import { SelectInput } from '@/components';
import { QUANTITY_OPTIONS } from '../constants';

const QuantityStep = ({ quantity, onQuantityChange }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Kuantitas</h2>
        <p className="text-color-secondary text-sm font-semibold">
          Minimal 1000 pcs (2 rim) · Kelipatan 500 pcs (1 rim)
        </p>
      </div>

      {/* Quantity Input */}
      <div className="max-w-md mb-6">
        <SelectInput
          label="Jumlah"
          unit="pcs"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          options={QUANTITY_OPTIONS}
          placeholder="Pilih jumlah"
        />
      </div>
    </div>
  );
};

export default QuantityStep;
