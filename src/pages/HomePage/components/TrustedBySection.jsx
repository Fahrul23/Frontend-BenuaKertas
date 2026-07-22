import React from 'react';
import { LOGOS } from '../constants';

const TrustedBySection = () => {
    return (
        <section className="w-full px-6 md:px-10 lg:px-16 py-12 md:py-16 bg-color-white">
            <div className="text-center mb-8 md:mb-12">
                <h2 className="font-bold text-color-black text-xl md:text-3xl mb-3">
                    Dipercayai oleh banyak brand
                </h2>
                <p className="text-color-gray text-xs md:text-base">
                    berbagai pilihan kemasan makanan berkualitas untuk bisnis anda
                </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 max-w-6xl mx-auto">
                {LOGOS.map((logo, idx) => (
                    <div key={idx} className="w-20 md:w-28 lg:w-32 h-16 md:h-20 flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer">
                        <img 
                            src={logo.url} 
                            alt={`${logo.name} Logo`} 
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TrustedBySection;
