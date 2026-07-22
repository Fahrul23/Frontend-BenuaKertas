# Custom Order Page - Documentation

## 📋 Overview
Halaman untuk melakukan custom order packaging dengan 8 langkah (steps) yang dipandu oleh stepper.

## 🎯 Struktur 8 Steps

### Steps yang Ditampilkan di Stepper:
1. **Step 1** - Model Produk
2. **Step 2** - Ukuran
3. **Step 3** - Bahan
4. **Step 4** - Warna Kemasan
5. **Step 5** - Finishing Laminasi
6. **...** (Ellipsis) - Menandakan ada step lainnya
7. **Step 8** - (Step terakhir)

### Steps yang Belum Diimplementasi (6, 7):
- Step 6 - (Belum ditentukan)
- Step 7 - (Belum ditentukan)

## 🎨 Design Stepper

### Width & Layout:
- **Container**: `max-w-7xl` (lebih lebar untuk menampung 8 steps)
- **Border**: 2px solid `color-secondary` (hijau)
- **Background**: White
- **Padding**: Responsive (px-4 md:px-8, py-4)

### Step Circle:
- **Outer Circle**: 28px x 28px (mobile), 34px x 34px (desktop)
- **Inner Circle**: 22px x 22px (mobile), 26px x 26px (desktop)
- **Active State**: Background `color-secondary`, text white
- **Inactive State**: Background white, text `color-secondary`

### Connecting Lines:
- **Height**: 1.5px
- **Color**: `color-secondary`
- **Position**: Aligned with circle centers (top: 14px/17px)
- **First Step**: Tidak ada garis di sebelah kiri
- **Last Step**: Tidak ada garis di sebelah kanan
- **Ellipsis**: Memiliki garis di kiri dan kanan

### Labels:
- **Font Size**: 9px (mobile), 10px (desktop)
- **Color**: `color-secondary`
- **Line Break**: Menggunakan `\n` untuk multi-line label
- **Max Width**: 50px (mobile), 70px (desktop)

## 📁 File Structure

```
CustomOrderPage/
├── CustomOrderPage.jsx       # Main component
├── constants/
│   └── index.js              # BOX_TYPES & STEPS data
└── README.md                 # This file
```

## 🔧 Props & State

### State:
- `currentStep` (number): Step yang sedang aktif (1-8)
- `selectedModel` (string|null): ID model box yang dipilih

### URL Params:
- `boxType` (string): Tipe box dari URL (earlock-box, top-bottom-box, dll)

## 🚀 Navigation Flow

1. User memilih tipe box di Custom Packaging page
2. Redirect ke `/custom-order/:boxType`
3. Step 1: Pilih model box
4. Klik "Tentukan Ukuran" → Step 2
5. ... (lanjut ke step berikutnya)
6. Step 8: Selesai

## 📝 TODO - Steps yang Perlu Diimplementasi

### Step 2 - Ukuran
- [ ] Form input: Panjang, Lebar, Tinggi
- [ ] Unit: cm atau mm
- [ ] Validasi input (harus angka positif)

### Step 3 - Bahan
- [ ] Pilihan jenis bahan kertas
- [ ] Ketebalan bahan
- [ ] Deskripsi setiap bahan

### Step 4 - Warna Kemasan
- [ ] Color picker atau preset colors
- [ ] Preview warna pada box

### Step 5 - Finishing Laminasi
- [ ] Pilihan jenis laminasi (glossy, matte, dll)
- [ ] Harga tambahan per jenis

### Step 6 - (Belum ditentukan)
- [ ] TBD

### Step 7 - (Belum ditentukan)
- [ ] TBD

### Step 8 - (Belum ditentukan)
- [ ] Review & Submit?
- [ ] Upload design file?
- [ ] Konfirmasi order?

## 🎨 Color Tokens Used

Sesuai Development Guide:
- `color-primary` (#5E9434) - Tidak digunakan di stepper
- `color-secondary` (#3E6D30) - **Digunakan untuk stepper**
- `color-darker` (#154321) - Heading
- `color-light` (#E3ECDA) - Background consultation box
- `color-black` (#000000) - Text
- `color-gray` (#6D747D) - Secondary text
- `color-white` (#FFFFFF) - Background

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔗 Related Components

- `Navbar` - Navigation bar
- `Footer` - Footer section
- `Stepper` - Stepper component (dari `@/components`)

## 📚 References

- Development Guide: `/DEVELOPMENT_GUIDE.md`
- Stepper Component: `/client/src/components/Stepper/Stepper.jsx`
