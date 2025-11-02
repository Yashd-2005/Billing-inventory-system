
import React, { useState } from 'react';
import { Product } from '../types';
import { Header } from '../components/Header';
import { Page } from '../App';

interface InventoryProps {
  setPage: (page: Page) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductModal: React.FC<{
    product: Product | null;
    onClose: () => void;
    onSave: (product: Product) => void;
}> = ({ product, onClose, onSave }) => {
    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price || 0);
    const [stock, setStock] = useState(product?.stock || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: product?.id || new Date().toISOString(),
            name,
            price,
            stock,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300">Product Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-slate-300">Price</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} min="0" step="0.01" required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-slate-300">Stock</label>
                        <input type="number" id="stock" value={stock} onChange={(e) => setStock(Number(e.target.value))} min="0" required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Inventory: React.FC<InventoryProps> = ({ setPage, products, setProducts }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleSaveProduct = (product: Product) => {
        if (selectedProduct) {
            setProducts(products.map(p => p.id === product.id ? product : p));
        } else {
            setProducts([...products, product]);
        }
    };

    const handleDeleteProduct = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const openModal = (product: Product | null = null) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 text-white bg-gradient-to-br from-gray-900 to-slate-800">
            <Header title="Inventory Management" onBack={() => setPage('dashboard')} />
            
            <div className="mb-6 flex justify-end">
                <button onClick={() => openModal()} className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-colors">
                    Add New Product
                </button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden shadow-lg">
                <table className="w-full text-left">
                    <thead className="bg-slate-700/50">
                        <tr>
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                                <td className="p-4">{product.name}</td>
                                <td className="p-4">${product.price.toFixed(2)}</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => openModal(product)} className="px-3 py-1 text-sm bg-yellow-600 rounded hover:bg-yellow-500">Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="px-3 py-1 text-sm bg-red-600 rounded hover:bg-red-500">Delete</button>
                                </td>
                            </tr>
                        ))}
                         {products.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center p-8 text-slate-400">No products in inventory. Add one to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <ProductModal product={selectedProduct} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} />}
        </div>
    );
};
