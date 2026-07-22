import { Lock, Layers, Package, Archive } from 'lucide-react';
import boxImg from '@/assets/box.svg';

export const CUSTOM_CATEGORIES = [
    {
        icon: Lock,
        title: '1. Earlock Box',
        desc: 'Box dengan sistem pengunci telinga di bagian atas dan bawah yang memberikan keamanan ekstra dan tampilan elegan.',
        image: boxImg,
        slug: 'earlock-box'
    },
    {
        icon: Layers,
        title: '2. Top and Bottom Box',
        desc: 'Box dua bagian (tutup dan alas) yang kokoh dan ideal untuk produk premium dengan kesan eksklusif.',
        image: boxImg,
        slug: 'top-bottom-box'
    },
    {
        icon: Package,
        title: '3. Clamshell Box',
        desc: 'Box dengan engsel di bagian belakang yang praktis dibuka dan ditutup, cocok untuk berbagai jenis produk.',
        image: boxImg,
        slug: 'clamshell-box'
    },
    {
        icon: Archive,
        title: '4. Tray Box',
        desc: 'Box dengan desain baki (tray) yang simpel namun fungsional, mudah diakses dan cocok untuk berbagai kebutuhan.',
        image: boxImg,
        slug: 'tray-box'
    },
];
