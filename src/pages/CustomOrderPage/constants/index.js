import boxImg from '@/assets/box.svg';
import duplexImg from '@/assets/duplex.svg';
import ivoryImg from '@/assets/ivory.svg';
import sisiLuarImg from '@/assets/sisi-luar.svg';
import dalamImg from '@/assets/dalam.svg';
import luarDalamImg from '@/assets/luar-dalam.svg';
import tanpaLaminasiImg from '@/assets/tanpa-laminasi.svg';
import glossyImg from '@/assets/glossy.svg';
import doffImg from '@/assets/doff.svg';
import satuSisiImg from '@/assets/1-sisi.svg';
import duaSisiImg from '@/assets/2-sisi.svg';

// Data untuk setiap tipe box
export const BOX_TYPES = {
  'earlock-box': {
    title: 'EARLOCK BOX',
    description: 'Atur spesifikasi custom Earlock Box sesuai kebutuhan, perhatikan setiap langkah di setiap bagiannya terisi sesuai dengan instruksi',
    models: [
      { id: 'earlock-box', name: 'Earlock Box', image: boxImg },
      { id: 'top-bottom-box', name: 'Top & Bottom Box', image: boxImg },
      { id: 'tray-box', name: 'Tray Box', image: boxImg },
    ]
  },
  'top-bottom-box': {
    title: 'TOP AND BOTTOM BOX',
    description: 'Atur spesifikasi custom Top and Bottom Box sesuai kebutuhan, perhatikan setiap langkah di setiap bagiannya terisi sesuai dengan instruksi',
    models: [
      { id: 'model-standard', name: 'Model Standard', image: boxImg },
      { id: 'model-premium', name: 'Model Premium', image: boxImg },
    ]
  },
  'tray-box': {
    title: 'TRAY BOX',
    description: 'Atur spesifikasi custom Tray Box sesuai kebutuhan, perhatikan setiap langkah di setiap bagiannya terisi sesuai dengan instruksi',
    models: [
      { id: 'tray-single', name: 'Tray Single', image: boxImg },
      { id: 'tray-double', name: 'Tray Double', image: boxImg },
    ]
  },
};

// Steps untuk stepper (8 steps total)
export const ALL_STEPS = [
  { id: 1, label: 'Model\nProduk' },
  { id: 2, label: 'Ukuran' },
  { id: 3, label: 'Bahan' },
  { id: 4, label: 'Warna\nKemasan' },
  { id: 5, label: 'Finishing\nLaminasi' },
  { id: 6, label: 'Unggah\nFile' },
  { id: 7, label: 'Tentukan\nKuantitas' },
  { id: 8, label: 'Review\nOrderan' },
];

// Text untuk tombol Next berdasarkan step
export const NEXT_BUTTON_TEXT = {
  1: 'Tentukan Ukuran',
  2: 'Tentukan Bahan',
  3: 'Tentukan Warna',
  4: 'Tentukan Laminasi',
  5: 'Unggah File',
  6: 'Tentukan Kuantitas',
  7: 'Review Order',
  8: 'Buat Pesanan',
};

/**
 * Fungsi untuk mendapatkan steps yang akan ditampilkan di stepper
 * Sekarang dikembalikan semua steps agar pengguna bisa melihat progress secara utuh.
 */
export const getVisibleSteps = (currentStep) => {
  return ALL_STEPS;
};

// Quantity options (dropdown)
export const QUANTITY_OPTIONS = [
  { value: '1000', label: '1000' },
  { value: '1500', label: '1500' },
  { value: '2000', label: '2000' },
  { value: '2500', label: '2500' },
  { value: '3000', label: '3000' },
  { value: '3500', label: '3500' },
  { value: '4000', label: '4000' },
  { value: '4500', label: '4500' },
  { value: '5000', label: '5000' },
];

// Materials — Kraft dihapus, hanya Duplex dan Ivory
export const MATERIALS = [
  { id: 'duplex', name: 'Duplex', image: duplexImg },
  { id: 'ivory', name: 'Ivory', image: ivoryImg },
];

// Thickness options per material
export const THICKNESS_OPTIONS_BY_MATERIAL = {
  duplex: [
    { label: '310 gsm', value: '310' },
    { label: '350 gsm', value: '350' },
    { label: '400 gsm', value: '400' },
  ],
  ivory: [
    { label: '230 gsm', value: '230' },
    { label: '250 gsm', value: '250' },
    { label: '270 gsm', value: '270' },
    { label: '300 gsm', value: '300' },
  ],
};

// Default thickness options (fallback)
export const THICKNESS_OPTIONS = [
  { label: '230 gsm', value: '230' },
  { label: '250 gsm', value: '250' },
  { label: '270 gsm', value: '270' },
  { label: '300 gsm', value: '300' },
  { label: '310 gsm', value: '310' },
  { label: '350 gsm', value: '350' },
  { label: '400 gsm', value: '400' },
];

export const LAMINATION_SIDE_OPTIONS = [
  { id: 'sisi-luar', name: 'Sisi Luar', image: sisiLuarImg },
  { id: 'dalam', name: 'Dalam', image: dalamImg },
  { id: 'luar-dan-dalam', name: 'Luar & Dalam', image: luarDalamImg },
  { id: 'tanpa-laminasi', name: 'Tanpa Laminasi', image: tanpaLaminasiImg },
];

export const LAMINATION_TYPE_OPTIONS = [
  { id: 'glossy', name: 'Glossy', image: glossyImg },
  { id: 'doff', name: 'Doff', image: doffImg },
];

export const COLOR_OPTIONS = [
  { id: '1-sisi', name: '1 Sisi', description: 'Cetak warna pada 1 sisi kemasan', image: satuSisiImg },
  { id: '2-sisi', name: '2 Sisi', description: 'Cetak warna pada 2 sisi kemasan', image: duaSisiImg },
];

/**
 * Format angka ke Rupiah
 */
export const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
