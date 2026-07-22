import { Calculator, Layers, Palette, Sparkles, Package, Grid3X3 } from 'lucide-react';
import { formatRupiah } from '../constants';

const PriceRow = ({ label, value, show = true, bold = false, highlight = false, icon: Icon }) => {
  if (!show) return null;
  
  return (
    <div className={`flex items-center justify-between py-1.5 ${highlight ? 'mt-2 pt-3 border-t border-white/20' : ''}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-white/70" />}
        <span className={`text-sm ${bold ? 'font-bold text-white' : 'text-white/80'}`}>
          {label}
        </span>
      </div>
      <span className={`text-sm ${bold ? 'font-bold text-white' : 'text-white/90'} ${highlight ? 'text-base font-extrabold' : ''}`}>
        {value}
      </span>
    </div>
  );
};

const PriceSummary = ({ pricingData = {} }) => {
  const {
    planoType,
    jumlahMata,
    hargaMaterial,
    hargaWarna,
    hargaLaminasi,
    subtotalPerUnit,
    quantity,
    totalPrice,
  } = pricingData;

  const hasAnyData = planoType || hargaMaterial || hargaWarna || hargaLaminasi !== undefined;

  if (!hasAnyData) return null;

  return (
    <div className="bg-gradient-to-br from-color-secondary to-color-secondary/80 rounded-xl p-5 mt-6 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Calculator size={18} className="text-white" />
        <h4 className="text-white font-bold text-sm">Kalkulasi Harga</h4>
      </div>

      <div className="space-y-0.5">
        <PriceRow
          icon={Grid3X3}
          label="Plano terpilih"
          value={planoType || '-'}
          show={!!planoType}
        />
        <PriceRow
          icon={Layers}
          label="Jumlah mata"
          value={jumlahMata ? `${jumlahMata} mata` : '-'}
          show={!!jumlahMata}
        />

        {(hargaMaterial || hargaWarna || hargaLaminasi !== undefined) && (
          <div className="border-t border-white/20 my-2" />
        )}

        <PriceRow
          icon={Package}
          label="Harga material"
          value={formatRupiah(hargaMaterial)}
          show={hargaMaterial !== null && hargaMaterial !== undefined}
        />
        <PriceRow
          icon={Palette}
          label="Harga warna"
          value={formatRupiah(hargaWarna)}
          show={hargaWarna !== null && hargaWarna !== undefined}
        />
        <PriceRow
          icon={Sparkles}
          label="Harga laminasi"
          value={formatRupiah(hargaLaminasi)}
          show={hargaLaminasi !== null && hargaLaminasi !== undefined}
        />

        {subtotalPerUnit && (
          <>
            <div className="border-t border-white/20 my-2" />
            <PriceRow
              label="Subtotal/plano"
              value={formatRupiah(subtotalPerUnit)}
              show={!!subtotalPerUnit}
              bold
            />
          </>
        )}

        {quantity && (
          <PriceRow
            label={`× ${Number(quantity).toLocaleString('id-ID')} pcs × 85`}
            value=""
            show={!!quantity}
          />
        )}

        {totalPrice && (
          <PriceRow
            label="Total harga"
            value={formatRupiah(totalPrice)}
            show={!!totalPrice}
            bold
            highlight
          />
        )}
      </div>
    </div>
  );
};

export default PriceSummary;
