import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadAPI } from '@/services/api';

const BoxModelModal = ({ mode, boxModel, onClose, onSave, onError }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    imageUrl: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 2MB for box model)
    if (file.size > 2 * 1024 * 1024) {
      if (onError) onError('Ukuran file melebihi batas 2MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      if (onError) onError('Format gambar tidak didukung. Gunakan jpg atau png');
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadAPI.uploadBoxModel(file);
      if (response.success) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: response.data.url,
        }));
        // Clear error for imageUrl if any
        if (errors.imageUrl) {
          setErrors((prev) => ({ ...prev, imageUrl: '' }));
        }
      } else {
        if (onError) onError(response.message || 'Gagal mengunggah gambar.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (onError) onError('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (mode === 'edit' && boxModel) {
      setFormData({
        code: boxModel.code || '',
        name: boxModel.name || '',
        description: boxModel.description || '',
        imageUrl: boxModel.imageUrl || '',
        isActive: boxModel.isActive !== undefined ? boxModel.isActive : true,
      });
    }
  }, [mode, boxModel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL or file upload is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const dataToSave = {
      ...formData,
    };

    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Add New Box Model' : 'Edit Box Model'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., earlock-box-depan"
            />
            {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Earlock Box Depan"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent"
              placeholder="Enter box model description..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Box Model Image <span className="text-red-500">*</span>
            </label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
                isDragging
                  ? 'border-color-secondary bg-color-light/30'
                  : 'border-gray-300 bg-white'
              } ${formData.imageUrl || isUploading ? 'p-6' : 'p-8'} mb-2`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <Loader2 size={32} className="text-color-secondary animate-spin mb-3" />
                  <p className="text-gray-900 font-medium">Sedang mengunggah gambar...</p>
                </div>
              ) : !formData.imageUrl ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 mb-3 rounded-full bg-gray-50 flex items-center justify-center">
                    <Upload size={24} className="text-color-secondary" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    Drag & drop gambar di sini atau
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-color-secondary font-semibold hover:underline">
                      Pilih File
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                  <p className="text-gray-500 text-xs mt-2">
                    Format: JPG, PNG (Max 2MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm max-w-[150px] sm:max-w-xs">
                        {formData.imageUrl.split('/').pop()}
                      </p>
                      <p className="text-xs text-green-600 font-medium mt-0.5">Gambar berhasil diunggah</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                      if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: '' }));
                    }}
                    className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              )}
            </div>

            {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>}
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-color-secondary border-gray-300 rounded focus:ring-color-secondary"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-color-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {mode === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoxModelModal;
