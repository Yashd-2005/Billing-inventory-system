import React, { useState, useEffect, useCallback } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Billing } from './pages/Billing';
import { Sales } from './pages/Sales';

const API_URL = 'http://localhost:3001/api';

const App = () => {
    const [page, setPage] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const productsResponse = await fetch(`${API_URL}/products`);
            if (!productsResponse.ok) throw new Error('Failed to fetch products');
            const productsData = await productsResponse.json();
            setProducts(productsData);

            const salesResponse = await fetch(`${API_URL}/sales`);
            if (!salesResponse.ok) throw new Error('Failed to fetch sales');
            const salesData = await salesResponse.json();
            setSales(salesData);
            
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDataUpdate = () => {
        fetchData(); // Refetch all data to ensure consistency
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">Loading data...</div>;
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-red-900 text-white flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-3xl font-bold mb-4">Connection Error</h1>
                <p className="mb-4">{error}</p>
                <p className="text-yellow-300">Please make sure the backend server is running on http://localhost:3001 and try again.</p>
                <button onClick={fetchData} className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">Retry Connection</button>
            </div>
        );
    }

    const renderPage = () => {
        switch (page) {
            case 'inventory':
                return <Inventory setPage={setPage} products={products} onDataUpdate={handleDataUpdate} />;
            case 'billing':
                return <Billing setPage={setPage} products={products} onDataUpdate={handleDataUpdate} />;
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
