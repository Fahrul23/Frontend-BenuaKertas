import editIcon from '@/assets/edit.svg';
import { formatRupiah } from '../constants';
import { Button } from '@/components';

// Custom SVG icons from assets
import modelProdukIcon from '@/assets/model_produk.svg';
import finishingIcon from '@/assets/finishing_laminasi.svg';
import ukuranIcon from '@/assets/ukuran_box_icon.svg';
import unggahFileIcon from '@/assets/unggah_file.svg';
import bahanIcon from '@/assets/bahan_kemasan.svg';
import warnaIcon from '@/assets/warna_kemasan.svg';
import kuantitasIcon from '@/assets/kuantitas.svg';
import estimasiIcon from '@/assets/estimasi_produk_icon.svg';

const ReviewStep = ({
  selectedModel,
  sizes,
  selectedMaterial,
  selectedThickness,
  selectedColor,
  laminationSide,
  laminationType,
  selectedFinishing,
  uploadedFile,
  quantity,
  boxData,
  pricingData = {},
  onEditStep,
  onEditAll,
  onNext,
}) => {
  // ──────────────────────────────────────────────
  // Derived labels
  // ──────────────────────────────────────────────
  const modelName = boxData.models.find((m) => m.id === selectedModel)?.name || '-';

  const sizeString =
    selectedModel === 'top-bottom-box'
      ? `${sizes.panjang} x ${sizes.lebar} x ${sizes.tinggi} cm – Tutup : ${sizes.tinggiTutup} cm`
      : selectedModel === 'earlock-box-samping'
        ? `${sizes.panjang} x ${sizes.lebar} x ${sizes.tinggi} cm – Lidah : ${sizes.lidah} cm`
        : `${sizes.panjang} x ${sizes.lebar} x ${sizes.tinggi} cm`;

  const materialName = selectedMaterial
    ? selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)
    : '-';

  const colorName = selectedColor === '1-sisi' ? '1 Sisi' : '2 Sisi';

  const laminationSideLabels = {
    'sisi-luar': 'Luar',
    'dalam': 'Dalam',
    'luar-dan-dalam': 'Luar & Dalam',
    'tanpa-laminasi': 'Tanpa Laminasi',
  };
  const laminationSideName = laminationSideLabels[laminationSide] || '-';

  const laminationTypeLabels = { glossy: 'Glossy', doff: 'Doff' };
  const laminationTypeName = laminationType ? laminationTypeLabels[laminationType] || laminationType : null;

  let finishingLabel = laminationTypeName
    ? `${laminationTypeName} (${laminationSideName})`
    : laminationSideName;

  if (selectedFinishing) {
    finishingLabel += ` + ${selectedFinishing}`;
  }

  const fileName = uploadedFile ? uploadedFile.name : '-';
  const qtyFormatted = quantity ? `${Number(quantity).toLocaleString('id-ID')} pcs` : '-';

  // ──────────────────────────────────────────────
  // Specification grid items
  // ──────────────────────────────────────────────
  const specItems = [
    { svgSrc: modelProdukIcon, label: 'Model Produk', value: modelName, step: 1 },
    { svgSrc: finishingIcon, label: 'Finishing Laminasi', value: finishingLabel, step: 5 },
    { svgSrc: ukuranIcon, label: 'Ukuran', value: sizeString, step: 2 },
    { svgSrc: unggahFileIcon, label: 'Unggah File', value: fileName, step: 6 },
    { svgSrc: bahanIcon, label: 'Bahan', value: `${materialName} ${selectedThickness} gsm`, step: 3 },
    { svgSrc: kuantitasIcon, label: 'Kuantitas Produk', value: qtyFormatted, step: 7 },
    { svgSrc: warnaIcon, label: 'Warna Kemasan', value: colorName, step: 4 },
    { svgSrc: estimasiIcon, label: 'Estimasi Produksi', value: '20 – 30 Hari Kerja', step: null, isEstimation: true },
  ];

  // ──────────────────────────────────────────────
  // Price summary rows
  // ──────────────────────────────────────────────
  const dpAmount = pricingData.totalBayar ? Math.round(pricingData.totalBayar * 0.6) : null;

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-color-dark mb-1">Preview Spesifikasi Kemasan</h2>
        <p className="text-color-gray text-sm font-semibold">
          Pastikan kembali kebutuhanmu, sebelum melanjutkan pembayaran
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ════════════════════════════════════════
            LEFT — Specification Preview (3/5)
        ════════════════════════════════════════ */}
        <div className="xl:col-span-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0px_0px_2px_rgba(0,0,0,0.10),0px_0px_3px_rgba(0,0,0,0.09),0px_0px_4px_rgba(0,0,0,0.05),0px_0px_5px_rgba(0,0,0,0.01),0px_0px_5px_rgba(0,0,0,0),0px_4px_4px_rgba(0,0,0,0.25)]">
            <h3 className="text-base font-bold text-gray-800 mb-5">Preview Spesifikasi Kemasan</h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {specItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {/* SVG Icon */}
                  <img src={item.svgSrc} alt={item.label} className="w-9 h-9 object-contain flex-shrink-0 mt-0.5" />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-color-dark font-semibold mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold break-words leading-snug text-gray-800">
                      {item.value}
                    </p>
                  </div>

                  {/* Edit button — always visible */}
                  {item.step && (
                    <button
                      onClick={() => onEditStep(item.step)}
                      className="flex-shrink-0 mt-0.5 hover:opacity-70 transition-opacity"
                      title={`Edit ${item.label}`}
                    >
                      <img src={editIcon} alt="Edit" className="w-7 h-7 object-contain" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT — Order & Price Summary (2/5)
        ════════════════════════════════════════ */}
        <div className="xl:col-span-2">

          {/* ── Ringkasan Pesanan + Ringkasan Harga dalam 1 card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0px_0px_2px_rgba(0,0,0,0.10),0px_0px_3px_rgba(0,0,0,0.09),0px_0px_4px_rgba(0,0,0,0.05),0px_0px_5px_rgba(0,0,0,0.01),0px_0px_5px_rgba(0,0,0,0),0px_4px_4px_rgba(0,0,0,0.25)]">

            {/* Ringkasan Pesanan */}
            <h3 className="text-base font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-2.5 text-sm">
              {[
                { label: 'Model Produk', value: modelName },
                { label: 'Ukuran', value: sizeString },
                { label: 'Bahan', value: `${materialName} ${selectedThickness} gsm` },
                { label: 'Tipe Laminasi', value: laminationTypeName || '-', hide: !laminationTypeName },
                { label: 'Sisi Laminasi', value: laminationSideName },
                { label: 'Kuantitas', value: qtyFormatted },
                { label: 'File Desain', value: fileName },
              ]
                .filter((r) => !r.hide)
                .map(({ label, value }, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <span className="text-gray-500 flex-shrink-0">{label}</span>
                    <span className="font-semibold text-gray-800 text-right break-all">{value}</span>
                  </div>
                ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-5" />

            {/* Ringkasan Harga */}
            <h3 className="text-base font-bold text-gray-800 mb-4">Ringkasan Harga</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Harga per pcs</span>
                <span className="font-semibold text-gray-800">
                  {pricingData.hargaPerPcs != null ? formatRupiah(pricingData.hargaPerPcs) : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total Bayar</span>
                <span className="font-semibold text-gray-800">
                  {pricingData.totalBayar != null ? formatRupiah(pricingData.totalBayar) : '-'}
                </span>
              </div>
            </div>

            {/* DP 60% highlight */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Bayar DP 60%</span>
                <span className="text-xl font-extrabold text-color-dark">
                  {dpAmount != null ? formatRupiah(dpAmount) : '-'}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={onNext}
              className="mt-5 w-full justify-center py-3 text-sm font-bold"
            >
              Lanjut Metode Pembayaran
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
