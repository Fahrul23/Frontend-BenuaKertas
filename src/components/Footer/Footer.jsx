import React from 'react';
import logoImg from '@/assets/logo-impepact.svg';

const Footer = () => {
    return (
        <footer className="bg-color-darker pt-12 md:pt-16 pb-6 text-white px-6 md:px-10 lg:px-16">
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="lg:col-span-2 pr-0 md:pr-10">
                        <img src={logoImg} alt="Impepac Logo" className="h-16 md:h-20 mb-6 brightness-0 invert" />
                        <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                            Solusi kemasan makanan berkualitas dengan bahan food grade dan desain custom untuk mendukung bisnis anda.
                        </p>
                    </div>

                    {/* Menu */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 md:mb-6">Menu</h4>
                        <ul className="space-y-3 md:space-y-4 text-white/80 text-xs md:text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Custom Packaging</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Katalog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Status Pesanan</a></li>
                        </ul>
                    </div>

                    {/* Bantuan */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 md:mb-6">Bantuan</h4>
                        <ul className="space-y-3 md:space-y-4 text-white/80 text-xs md:text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Cara Pemesanan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pengiriman</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pembayaran</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Butuh Bantuan</a></li>
                        </ul>
                    </div>

                    {/* Kontak Kami */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 md:mb-6">Kontak Kami</h4>
                        <ul className="space-y-3 md:space-y-4 text-white/80 text-xs md:text-sm">
                            <li>0813-2120-2530</li>
                            <li><a href="mailto:info.imperialindopack@gmail.com" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">info.imperialindopack@gmail.com</a></li>
                            <li className="leading-relaxed mt-4">
                                Jl. Jatinegara Barat , No. 163<br />
                                Jakarta Timur, 13310
                            </li>
                        </ul>
                    </div>

                    {/* Jam Operasional */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 md:mb-6">Jam Operasional</h4>
                        <div className="space-y-4 text-white/80 text-xs md:text-sm">
                            <div>
                                <p className="font-medium text-white mb-1">Senin - Jumat</p>
                                <p>08.30 - 16.30 WIB</p>
                            </div>
                            <div>
                                <p className="font-medium text-white mb-1">Sabtu</p>
                                <p>08.30 - 15.00 WIB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-color-white text-center text-white/60 text-[10px] md:text-xs">
                    <p>&copy; 2026 Imperial Indopack. All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
