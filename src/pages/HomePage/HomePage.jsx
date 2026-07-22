import React from 'react';
import { Navbar, Footer } from '@/components';
import HeroSection from './components/HeroSection';
import OrderStatusSection from './components/OrderStatusSection';
import QualityPackagingSection from './components/QualityPackagingSection';
import OrderProcessSection from './components/OrderProcessSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import TrustedBySection from './components/TrustedBySection';
import CtaSection from './components/CtaSection';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-color-white">
            <Navbar />
            <HeroSection />
            <OrderStatusSection />
            <QualityPackagingSection />
            <OrderProcessSection />
            <FeaturedProductsSection />
            <WhyChooseUsSection />
            <TrustedBySection />
            <CtaSection />
            <Footer />
        </div>
    );
};

export default HomePage;
