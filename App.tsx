
import React, { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Billing } from './pages/Billing';
import { Sales } from './pages/Sales';
import { Product, Sale } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

export type Page = 'dashboard' | 'inventory' | 'billing' | 'sales';

// Initial mock data for demonstration
const initialProducts: Product[] = [
    { id: '1', name: 'Laptop Pro', price: 1200, stock: 15 },
    { id: '2', name: 'Wireless Mouse', price: 25, stock: 50 },
    { id: '3', name: 'Mechanical Keyboard', price: 150, stock: 30 },
    { id: '4', name: '4K Monitor', price: 450, stock: 20 },
    { id: '5', name: 'Webcam HD', price: 80, stock: 40 },
];

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('dashboard');
    const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
    const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
    
    const addSale = (sale: Sale) => {
        setSales(prevSales => [...prevSales, sale]);
    };

    const renderPage = () => {
        switch (page) {
            case 'inventory':
                return <Inventory setPage={setPage} products={products} setProducts={setProducts} />;
            case 'billing':
                return <Billing setPage={setPage} products={products} setProducts={setProducts} addSale={addSale} />;
            case 'sales':
                return <Sales setPage={setPage} sales={sales} />;
            case 'dashboard':
            default:
                return <Dashboard setPage={setPage} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {renderPage()}
        </div>
    );
};

export default App;
