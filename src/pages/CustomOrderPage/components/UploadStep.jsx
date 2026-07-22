import { useState } from 'react';
import { Upload, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { uploadAPI } from '@/services/api';

const UploadStep = ({ uploadedFile, note, onFileUpload, onNoteChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file melebihi batas 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format file tidak didukung. Gunakan pdf, jpg, png, atau svg');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadAPI.uploadDesign(file);
      if (response.success) {
        onFileUpload({
          name: response.data.originalName || file.name,
          size: response.data.size || file.size,
          url: response.data.url,
          publicId: response.data.publicId,
          format: response.data.format
        });
      } else {
        setError(response.message || 'Gagal mengunggah file. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Terjadi kesalahan koneksi saat mengunggah file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemoveFile = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      if (uploadedFile.publicId) {
        await uploadAPI.deleteFile(uploadedFile.publicId);
      }
      onFileUpload(null);
    } catch (err) {
      console.error('Delete error:', err);
      // Selesaikan penghapusan lokal meskipun API gagal agar user tidak tersangkut
      onFileUpload(null);
    } finally {
      setIsUploading(false);
    }
  };

  const isImage = uploadedFile && (
    ['jpg', 'jpeg', 'png', 'svg'].includes(uploadedFile.format?.toLowerCase()) ||
    /\.(jpg|jpeg|png|svg)$/i.test(uploadedFile.name)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Unggah File</h2>
        <p className="text-color-secondary text-sm font-semibold">File dalam bentuk (pdf, jpg, png, dan svg)</p>
      </div>

      {/* Upload Area */}
      <div className="mb-8">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
            isDragging
              ? 'border-color-secondary bg-color-light/30'
              : 'border-gray-300 bg-white'
          } ${uploadedFile || isUploading ? 'p-6' : 'p-12'}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <Loader2 size={36} className="text-color-secondary animate-spin mb-3" />
              <p className="text-color-black font-semibold">Sedang memproses file...</p>
              <p className="text-color-gray text-sm mt-1">Mohon tunggu sebentar</p>
            </div>
          ) : !uploadedFile ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-color-light flex items-center justify-center">
                <Upload size={32} className="text-color-secondary" />
              </div>
              <p className="text-color-black font-semibold mb-2">
                Drag & drop file di sini atau
              </p>
              <label className="cursor-pointer">
                <span className="text-color-secondary font-semibold hover:underline">
                  Pilih File
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.svg"
                  onChange={handleFileInputChange}
                  disabled={isUploading}
                />
              </label>
              <p className="text-color-gray text-sm mt-2">
                Format: PDF, JPG, PNG, SVG (Max 5MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                  {isImage && uploadedFile.url ? (
                    <img src={uploadedFile.url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileText size={24} className="text-color-secondary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-color-black truncate max-w-[200px] md:max-w-xs">{uploadedFile.name}</p>
                  <p className="text-sm text-color-gray">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                disabled={isUploading}
                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors duration-300 disabled:opacity-50"
              >
                <X size={18} className="text-red-600" />
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            <div className="flex-1">{error}</div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-semibold text-xs">
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Note Area */}
      <div>
        <label className="block mb-3">
          <span className="text-color-secondary font-semibold">Note</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Tambahkan catatan atau instruksi khusus untuk pesanan Anda..."
          rows={5}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-color-secondary focus:outline-none transition-colors duration-300 resize-none text-color-black placeholder:text-color-gray"
        />
      </div>
    </div>
  );
};

export default UploadStep;
