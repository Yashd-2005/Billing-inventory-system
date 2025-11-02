import React, { useMemo } from 'react';
import { Header } from '../components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Sales = ({ setPage, sales }) => {
  const { totalRevenue, totalSales, salesByDay } = useMemo(() => {
    const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const numSales = sales.length;

    const dailyData = {};
    sales.forEach(sale => {
      const date = new Date(sale.date).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = 0;
      }
      dailyData[date] += sale.total;
    });
    
    const chartData = Object.keys(dailyData).map(date => ({
        name: date,
        Revenue: dailyData[date]
    })).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());


    return { totalRevenue: revenue, totalSales: numSales, salesByDay: chartData };
  }, [sales]);

  return (
    <div className="min-h-screen p-4 sm:p-8 text-white bg-gradient-to-br from-gray-900 to-slate-800">
      <Header title="Sales Report" onBack={() => setPage('dashboard')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <h3 className="text-slate-400 mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold">₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <h3 className="text-slate-400 mb-2">Total Sales</h3>
          <p className="text-4xl font-bold">{totalSales}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 h-[60vh]">
        <h3 className="text-xl font-bold mb-4">Daily Revenue</h3>
        {sales.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesByDay}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#cbd5e1' }}
                formatter={(value) => `₹${value.toFixed(2)}`}
              />
              <Legend wrapperStyle={{ color: '#cbd5e1' }} />
              <Bar dataKey="Revenue" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
             <div className="h-full flex items-center justify-center">
                <p className="text-slate-400">No sales data available yet. Generate a bill to see reports.</p>
            </div>
        )}
      </div>
    </div>
  );
};
