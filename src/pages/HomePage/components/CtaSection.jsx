import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components';
import sushieImg from '@/assets/sushie.svg';

const CtaSection = () => {
    return (
        <section className="w-full px-6 md:px-10 lg:px-16 py-12 md:py-20 bg-color-white">
            <div className="max-w-6xl mx-auto bg-[#F1F6E9] rounded-[20px] px-8 md:px-12 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden">
                
                {/* Left Text & CTA */}
                <div className="w-full md:w-3/5 flex flex-col items-start z-10">
                    <h2 className="font-bold text-color-black text-2xl md:text-3xl lg:text-4xl leading-tight mb-4">
                        Siap Membuat Kemasan Custom <br className="hidden lg:block" />
                        Untuk Bisnis Anda?
                    </h2>
                    <p className="text-color-gray text-sm md:text-base mb-8">
                        Hubungi kami sekarang dan dapatkan penawaran terbaik!
                    </p>
                    <Button 
                        className="px-6 md:px-8 py-3 bg-[#3E6D30] hover:bg-[#154321] text-white shadow-md shadow-green-900/10 transition-colors"
                        iconRight={<ArrowRight size={18} />}
                    >
                        Pesan Sekarang
                    </Button>
                </div>

                {/* Right Image */}
                <div className="w-full md:w-2/5 flex justify-center md:justify-end z-10">
                    <img 
                        src={sushieImg} 
                        alt="Kemasan Sushi Custom" 
                        className="w-full max-w-[320px] lg:max-w-[400px] h-auto object-contain scale-110 md:scale-125 md:translate-x-4 lg:translate-x-8"
                    />
                </div>

            </div>
        </section>
    );
};

export default CtaSection;
