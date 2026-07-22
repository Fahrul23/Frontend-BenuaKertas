import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CUSTOM_CATEGORIES } from '../constants';

const ProductGrid = () => {
    const navigate = useNavigate();

    const handleCustomClick = (slug) => {
        navigate(`/custom-order/${slug}`);
    };

    return (
        <section className="w-full px-6 md:px-10 lg:px-16 py-16 bg-color-white">
            <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                <span className="block text-color-primary font-bold text-sm tracking-widest uppercase mb-3">
                    Custom Packaging
                </span>
                <h2 className="font-bold text-color-black text-2xl md:text-3xl lg:text-4xl mb-4">
                    Pilih Jenis Box yang Anda Butuhkan
                </h2>
                <p className="text-color-gray text-sm md:text-base max-w-xl mx-auto">
                    Kami menyediakan berbagai jenis box berkualitas yang dapat disesuaikan dengan kebutuhan produk Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {CUSTOM_CATEGORIES.map((category, idx) => {
                    const IconComponent = category.icon;
                    return (
                        <div 
                            key={idx} 
                            className="bg-color-white rounded-[15px] p-5 md:p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-full bg-color-lighter flex items-center justify-center mb-6">
                                <IconComponent size={18} className="text-color-primary" />
                            </div>
                            
                            {/* Image Area */}
                            <div className="relative w-full aspect-square flex items-center justify-center mb-8">
                                <img src={category.image} alt={category.title} className="relative z-10 w-[80%] h-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300" />
                            </div>
                            
                            {/* Text Area */}
                            <div className="flex-1 flex flex-col">
                                <h3 className="font-bold text-[#154321] text-[17px] mb-3">
                                    {category.title}
                                </h3>
                                <p className="text-color-gray text-[13px] leading-relaxed flex-1">
                                    {category.desc}
                                </p>
                            </div>
                            
                            {/* Button */}
                            <button 
                                onClick={() => handleCustomClick(category.slug)}
                                className="mt-6 w-full py-2.5 px-4 border border-color-primary rounded-[8px] text-color-primary font-semibold text-sm flex items-center justify-between hover:bg-color-primary hover:text-white transition-colors duration-300 group/btn"
                            >
                                <span>Custom Sekarang</span>
                                <ArrowRight size={18} className="text-color-primary group-hover/btn:text-white transition-colors" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ProductGrid;
