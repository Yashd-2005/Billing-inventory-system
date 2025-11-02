import React, { useState, useRef } from 'react';
import { Header } from '../components/Header';
import { useReactToPrint } from 'react-to-print';

const BillPrintComponent = React.forwardRef(({ items, total }, ref) => (
    <div ref={ref} className="p-8 text-black bg-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Invoice</h1>
        <table className="w-full mb-4">
            <thead>
                <tr className="border-b">
                    <th className="text-left p-2">Item</th>
                    <th className="text-center p-2">Qty</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id} className="border-b">
                        <td className="p-2">{item.name}</td>
                        <td className="text-center p-2">{item.quantity}</td>
                        <td className="text-right p-2">${item.price.toFixed(2)}</td>
                        <td className="text-right p-2">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="text-right mt-6">
            <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
        </div>
    </div>
));


export const Billing = ({ setPage, products, setProducts, addSale }) => {
  const [billItems, setBillItems] = useState([]);
  const componentToPrintRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const addToBill = (product) => {
    if(product.stock <= 0) {
        alert(`${product.name} is out of stock!`);
        return;
    }
    const existingItem = billItems.find(item => item.id === product.id);
    if (existingItem) {
        if(existingItem.quantity >= product.stock) {
             alert(`Cannot add more ${product.name}. Stock limit reached.`);
             return;
        }
        setBillItems(billItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    } else {
        setBillItems([...billItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (newQuantity > product.stock) {
        alert(`Cannot set quantity for ${product.name} higher than stock (${product.stock}).`);
        newQuantity = product.stock;
    }
    
    if (newQuantity <= 0) {
        setBillItems(billItems.filter(item => item.id !== productId));
    } else {
        setBillItems(billItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
    }
  };

  const total = billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const finalizeBill = () => {
    if (billItems.length === 0) {
        alert("Cannot generate an empty bill.");
        return;
    }

    // 1. Update stock
    const newProducts = products.map(p => {
        const billedItem = billItems.find(item => item.id === p.id);
        if (billedItem) {
            return { ...p, stock: p.stock - billedItem.quantity };
        }
        return p;
    });
    setProducts(newProducts);

    // 2. Create sale record
    const newSale = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        items: billItems,
        total: total,
    };
    addSale(newSale);

    // 3. Print
    handlePrint();
    
    // 4. Clear bill
    setBillItems([]);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 text-white bg-gradient-to-br from-gray-900 to-slate-800">
      <Header title="Billing Section" onBack={() => setPage('dashboard')} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product List */}
        <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 h-[75vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Available Products</h2>
          <div className="space-y-2">
            {products.filter(p => p.stock > 0).map(product => (
              <div key={product.id} onClick={() => addToBill(product)} className="flex justify-between items-center p-3 bg-slate-700 rounded-md cursor-pointer hover:bg-slate-600 transition">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-slate-400">Stock: {product.stock}</p>
                </div>
                <p className="font-bold">${product.price.toFixed(2)}</p>
              </div>
            ))}
             {products.filter(p => p.stock > 0).length === 0 && (
                <p className="text-center p-8 text-slate-400">All products are out of stock.</p>
             )}
          </div>
        </div>

        {/* Current Bill */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 flex flex-col h-[75vh]">
          <h2 className="text-2xl font-bold mb-4">Current Invoice</h2>
          <div className="flex-grow overflow-y-auto pr-2">
            {billItems.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-3 p-3 bg-slate-900/50 rounded-md">
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-slate-400">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value))} className="w-16 text-center bg-slate-700 border-slate-600 rounded-md text-white" />
                </div>
                <p className="w-24 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            {billItems.length === 0 && (
                <div className="h-full flex items-center justify-center">
                    <p className="text-slate-400">Click a product to add it to the bill.</p>
                </div>
            )}
          </div>
          <div className="border-t border-slate-700 mt-4 pt-4">
            <div className="flex justify-between items-center text-3xl font-bold mb-4">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setBillItems([])} className="flex-1 py-3 bg-slate-600 rounded-lg hover:bg-slate-500 transition font-semibold">Clear Bill</button>
              <button onClick={finalizeBill} className="flex-1 py-3 bg-green-600 rounded-lg hover:bg-green-500 transition font-semibold">Generate & Print Bill</button>
            </div>
          </div>
        </div>
      </div>
       <div style={{ display: "none" }}>
        <BillPrintComponent ref={componentToPrintRef} items={billItems} total={total} />
      </div>
    </div>
  );
};