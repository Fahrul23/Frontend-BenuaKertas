import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components';
import { FEATURED_PRODUCTS_DATA } from '../constants';
import { masterDataAPI } from '@/services/api';
import boxImg from '@/assets/box.svg';

const FeaturedProductsSection = () => {
    const navigate = useNavigate();
    const [boxModels, setBoxModels] = useState([]);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await masterDataAPI.getBoxModels();
                if (res.success && res.data.length > 0) {
                    setBoxModels(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch models from API', err);
            }
        };
        fetchModels();
    }, []);

    const handleCustomNow = (modelId) => {
        navigate('/custom-order', { state: { preSelectedModel: modelId } });
    };

    const handleViewAll = () => {
        navigate('/custom-order');
    };

    return (
        <section className="w-full px-6 md:px-10 lg:px-16 py-10 md:py-16 bg-color-white">
            <div className="text-center mb-10 md:mb-12">
                <h2 className="font-bold text-color-black text-xl md:text-3xl mb-3">
                    Produk Unggulan
                </h2>
                <p className="text-color-gray text-xs md:text-base">
                    Berbagai pilihan kemasan makanan berkualitas untuk bisnis anda
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {FEATURED_PRODUCTS_DATA.map((product, idx) => {
                    const matchedModel = boxModels.find(m => m.code === product.id);
                    const imageUrl = matchedModel?.imageUrl || boxImg;

                    return (
                        <div key={idx} className="flex flex-col relative group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                            {/* Gray Background Image Placeholder */}
                            <div className="w-full h-[185px] md:h-[240px] bg-[#F0F1F1] rounded-[5px] relative z-0 flex items-center justify-center p-4">
                                <img src={imageUrl} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>

                        {/* White Card overlapping the gray area */}
                        <div className="bg-color-white border border-[#E3ECDA] rounded-[5px] p-3 md:p-5 flex flex-col shadow-sm mt-[-20px] relative z-10 group-hover:shadow-md transition-all group-hover:border-color-primary flex-1">
                            <h3 className="font-bold text-color-black text-sm md:text-base mb-1">
                                {product.title}
                            </h3>
                            <p className="text-color-gray text-[10px] md:text-xs mb-4 md:mb-6 flex-1">
                                {product.desc}
                            </p>
                            <Button 
                                variant="outline" 
                                className="w-full justify-center py-2 md:py-3 px-2 text-[10px] md:text-sm hover:bg-color-primary hover:text-white transition-colors" 
                                iconRight={<ArrowRight size={14} />}
                                onClick={() => handleCustomNow(product.id)}
                            >
                                Custom Sekarang
                            </Button>
                        </div>
                    </div>
                );
            })}
            </div>

            {/* View All Button */}
            <div className="mt-10 md:mt-12 flex justify-center">
                <Button 
                    className="px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base" 
                    iconRight={<ArrowRight size={18} />}
                    onClick={handleViewAll}
                >
                    Lihat Semua Produk
                </Button>
            </div>
        </section>
    );
};

export default FeaturedProductsSection;
