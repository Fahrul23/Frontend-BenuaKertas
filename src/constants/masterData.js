export const THICKNESS_OPTIONS = [300, 350, 400, 450];

export const COLOR_SIDES_OPTIONS = ['1-sisi', '2-sisi'];

export const LAMINATION_PART_OPTIONS = ['sisi-luar', 'dalam', 'luar-dan-dalam', 'tanpa-laminasi'];

export const LAMINATION_PART_LABELS = {
  'sisi-luar': 'Sisi Luar',
  'dalam': 'Dalam',
  'luar-dan-dalam': 'Luar & Dalam',
  'tanpa-laminasi': 'Tanpa Laminasi'
};

export const LAMINATION_TYPE_OPTIONS = ['glossy', 'doff'];

export const GSM_PRICES = [
  { key: 'price300gsm', label: '300 gsm' },
  { key: 'price350gsm', label: '350 gsm' },
  { key: 'price400gsm', label: '400 gsm' },
  { key: 'price450gsm', label: '450 gsm' },
];

export const CATEGORY_LABELS = {
  side: 'Sisi Laminasi',
  type: 'Tipe Laminasi',
};

export const CATEGORY_COLORS = {
  side: 'bg-blue-100 text-blue-800',
  type: 'bg-purple-100 text-purple-800',
};

export const CATEGORY_OPTIONS = [
  { value: 'side', label: 'Sisi Laminasi (side)' },
  { value: 'type', label: 'Tipe Laminasi (type)' },
];
