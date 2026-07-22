import { Check } from 'lucide-react';
import SkeletonCard from './SkeletonCard';

const ModelStep = ({ models, selectedModel, onModelSelect, isLoading = false }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-2">Model & Tipe Box</h2>
        <p className="text-color-secondary text-sm font-semibold">Tipe Model</p>
      </div>

      {/* card model product */}
      <div className="grid grid-cols-3 gap-4">
        {isLoading || models.length === 0
          ? // Skeleton — tampilkan 3 placeholder cards
            Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} variant="model" />
            ))
          : models.map((model) => (
              <div
                key={model.id}
                onClick={() => onModelSelect(model.id)}
                className={`relative bg-color-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-[0px_0px_2px_rgba(0,0,0,0.10),0px_0px_3px_rgba(0,0,0,0.09),0px_0px_4px_rgba(0,0,0,0.05),0px_0px_5px_rgba(0,0,0,0.01),0px_0px_5px_rgba(0,0,0,0),0px_4px_4px_rgba(0,0,0,0.25)] hover:shadow-lg hover:-translate-y-1 hover:border-color-secondary ${
                  selectedModel === model.id
                    ? 'border-color-secondary shadow-md'
                    : 'border-gray-200'
                }`}
              >
                {/* Checkmark - Top Left */}
                {selectedModel === model.id && (
                  <div className="absolute -top-2 -left-2 w-[24px] h-[24px] md:w-[28px] md:h-[28px] bg-color-secondary rounded-full flex items-center justify-center shadow-md z-10">
                    <Check size={14} className="md:w-4 md:h-4 text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Image */}
                <div className="flex items-center justify-center mb-4 h-32">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-contain transition-transform duration-300"
                  />
                </div>

                {/* Name */}
                <p className="text-center font-semibold text-color-black text-sm">
                  {model.name}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ModelStep;
