import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components';
import { Package, ArrowRight, MessageCircle } from 'lucide-react';

const OrderStatusSection = () => {
    const navigate = useNavigate();

    return (
        <section className="w-full px-6 md:px-10 lg:px-16 pb-12">
            <div
                className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 bg-color-dark px-6 md:px-10 py-8 md:py-10 text-white"
                style={{
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                }}
            >
                {/* ── Kiri: Ikon + Teks ── */}
                <div className="flex items-start md:items-center gap-5 w-full md:w-3/5">
                    {/* Icon circle */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Package size={28} className="text-white" />
                    </div>
                    {/* Teks */}
                    <div>
                        <h3 className="font-bold text-xl md:text-2xl leading-tight mb-2">
                            Buat Box Custom Anda Sekarang
                        </h3>
                        <p className="text-white/80 text-sm md:text-base leading-relaxed">
                            Pilih ukuran, bahan, dan desain sesuai dengan kebutuhan brand Anda. Konsultasikan dengan tim ahli kami untuk hasil yang sempurna.
                        </p>
                    </div>
                </div>

                {/* ── Kanan: Actions ── */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 md:gap-4 shrink-0">
                    <Button 
                        onClick={() => navigate('/custom-order')}
                        className="w-full sm:w-auto bg-white text-color-dark hover:bg-gray-100 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg text-sm md:text-base group"
                    >
                        <span>Mulai Pesan</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <a 
                        href="https://wa.me/6281212949135" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto border-2 border-white/30 hover:border-white text-white hover:bg-white/10 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all text-sm md:text-base"
                    >
                        <MessageCircle size={18} />
                        <span>Konsultasi</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default OrderStatusSection;
