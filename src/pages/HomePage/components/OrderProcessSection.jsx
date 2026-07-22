import React from 'react';
import { ORDER_PROCESS_DATA } from '../constants';

const OrderProcessSection = () => {
    return (
        <section className="w-full px-6 md:px-10 lg:px-16 py-10 md:py-16 bg-color-white">
            <div className="text-center mb-10 md:mb-16">
                <h2 className="font-bold text-color-black text-xl md:text-3xl mb-3">
                    Proses Pemesanan Mudah
                </h2>
                <p className="text-color-gray text-xs md:text-base">
                    Hanya 6 langkah mudah untuk mendapatkan kemasan kustom impian anda.
                </p>
            </div>

            <div className="relative w-full">
                {/* Garis Horizontal Penghubung (Hanya Desktop) */}
                <div className="hidden md:block absolute top-[40px] left-[8%] right-[8%] h-[2px] bg-color-primary z-0"></div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4 relative z-10">
                    {ORDER_PROCESS_DATA.map((step, idx) => (
                        <div key={step.title} className="group flex flex-row md:flex-col items-center md:items-center gap-5 md:gap-0 w-full md:flex-1 cursor-pointer relative">
                            {/* Garis Vertikal Penghubung (Hanya Mobile) */}
                            {idx !== 5 && (
                                <div className="md:hidden absolute top-[30px] left-[29px] w-[2px] h-[calc(100%+32px)] bg-color-primary -z-10"></div>
                            )}
                            
                            {/* Icon Circle */}
                            <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full border-[2px] border-color-light bg-color-white flex items-center justify-center mb-0 md:mb-5 group-hover:border-color-primary group-hover:shadow-[0_0_15px_rgba(94,148,52,0.3)] group-hover:-translate-y-2 transition-all duration-300 flex-shrink-0 relative z-10">
                                <img src={step.icon} alt={step.title} className="w-7 h-7 md:w-10 md:h-10 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            
                            {/* Text Content */}
                            <div className="flex-1 md:text-center mt-1 md:mt-0">
                                <h3 className="font-bold text-color-black text-sm md:text-sm mb-1.5 md:mb-2 group-hover:text-color-primary transition-colors duration-300 leading-tight">
                                    {step.title}
                                </h3>
                                <p className="text-color-gray text-[11px] md:text-xs leading-relaxed max-w-[150px] mx-auto md:mx-0">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OrderProcessSection;
