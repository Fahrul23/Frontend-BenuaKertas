import { Check } from 'lucide-react';
import { RadioButton } from '@/components';
import { cn } from '@/utils';

const MaterialStep = ({ materials = [], selectedMaterial, selectedThickness, thicknessOptions = [], onMaterialSelect, onThicknessSelect }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Bahan Box</h2>
        <p className="text-color-secondary text-sm font-semibold">Tentukan Bahan</p>
      </div>

      {/* Material Selection */}
      {materials.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
          Memuat data bahan...
        </div>
      ) : (
        <div className="flex items-start gap-6 mb-8">
          {materials.map((material) => (
            <div
              key={material.id}
              onClick={() => onMaterialSelect(material.id)}
              className="relative cursor-pointer group w-[140px] md:w-[180px] lg:w-[200px] flex-shrink-0"
            >
              {/* Card Container */}
              <div className="relative w-full aspect-square">
                {/* Background with shadow */}
                <div className={cn(
                  "absolute inset-0 bg-white rounded-lg transition-all duration-300",
                  "shadow-[0px_0px_2px_rgba(0,0,0,0.10),0px_0px_3px_rgba(0,0,0,0.09),0px_0px_4px_rgba(0,0,0,0.05),0px_0px_5px_rgba(0,0,0,0.01),0px_0px_5px_rgba(0,0,0,0),0px_4px_4px_rgba(0,0,0,0.25)]",
                  selectedMaterial === material.id
                    ? 'ring-2 ring-color-secondary scale-105'
                    : 'group-hover:ring-2 group-hover:ring-color-secondary group-hover:scale-105 group-hover:shadow-lg'
                )} />

                {/* Checkmark */}
                {selectedMaterial === material.id && (
                  <div className="absolute -top-3 -left-3 w-6 h-6 md:w-7 md:h-7 bg-color-secondary rounded-full flex items-center justify-center shadow-md z-10 animate-in zoom-in duration-300">
                    <Check size={16} className="text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Image Container */}
                <div className="absolute inset-2 md:inset-3 bottom-10 md:bottom-12 bg-white overflow-hidden rounded transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
                  {material.image ? (
                    <img
                      src={material.image}
                      alt={material.name}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-400">No img</span>
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="absolute left-0 bottom-0 w-full h-10 md:h-12 flex items-center justify-center">
                  <span className="text-xs md:text-sm font-semibold text-black transition-colors duration-300 group-hover:text-color-secondary">
                    {material.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Thickness Selection */}
      {selectedMaterial && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-bold text-black mb-4">Ketebalan Bahan</h3>
          {thicknessOptions.length === 0 ? (
            <p className="text-sm text-gray-400">Memuat opsi ketebalan...</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {thicknessOptions.map((option) => (
                <RadioButton
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  name="thickness"
                  checked={selectedThickness === option.value}
                  onChange={(e) => onThicknessSelect(e.target.value)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MaterialStep;
