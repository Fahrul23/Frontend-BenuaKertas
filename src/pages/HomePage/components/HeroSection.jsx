import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components';
import ilustrasiImg from '@/assets/ilustration.svg';
import leafIconImg from '@/assets/leaf-icon.svg';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="w-full bg-color-white overflow-hidden">
            {/* Container tanpa padding & max-width supaya gambar bisa nempel ke kanan browser */}
            <div className="flex flex-col md:flex-row items-center">

                {/* ── Left: Text Content — padding hanya di sini ── */}
                <div className="w-full md:w-1/2 flex flex-col gap-4 px-6 md:pl-10 lg:pl-16 py-8 md:py-10 z-10">

                    {/* Badge */}
                    <div className="flex items-center gap-2">
                        <img src={leafIconImg} alt="Leaf Icon" className="w-5 h-auto object-contain" />
                        <span className="text-color-primary font-medium text-xs md:text-base">
                            Food Grade Packaging
                        </span>
                    </div>

                    {/* Headline */}
                    <div className='mb-2'>
                        <h1 className="text-[26px] md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            Custom Box Makanan
                            <br />
                            Food Grade untuk
                        </h1>
                        <h1 className="text-[26px] md:text-4xl lg:text-5xl font-bold text-color-dark leading-tight mt-1">
                            Bisnis Anda
                        </h1>
                    </div>

                    {/* Description */}
                    <p className="text-color-gray text-sm md:text-base leading-relaxed">
                        Kemasan berkualitas tinggi, aman untuk makanan,
                        <br />
                        desain custom sesuai brand anda.
                        <br />
                        Minimal order 500 pcs.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <Button 
                            iconRight={<ArrowRight size={16} />}
                            onClick={() => navigate('/custom-order')}
                        >
                            Mulai Custom
                        </Button>
                        <Button variant="outline" iconRight={<ArrowRight size={16} />}>
                            Lihat Katalog
                        </Button>
                    </div>
                </div>

                {/* ── Right: Hero Image ── */}
                <div className="hidden md:flex md:w-1/2 items-center justify-center">
                    <img
                        src={ilustrasiImg}
                        alt="Hero Illustration"
                        className="w-full object-contain"
                    />
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
