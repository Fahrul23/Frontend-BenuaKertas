import React from 'react';
import { Navbar, Footer } from '@/components';
import ProductGrid from './components/ProductGrid';

const CustomPackagingPage = () => {
    return (
        <div className="min-h-screen bg-color-white flex flex-col">
            <Navbar />
            <main className="flex-1">
                <ProductGrid />
            </main>
            <Footer />
        </div>
    );
};

export default CustomPackagingPage;
