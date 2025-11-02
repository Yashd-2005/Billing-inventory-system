
import React from 'react';
import { FeatureCard } from '../components/FeatureCard';
import { InventoryIcon, SalesIcon, BillingIcon } from '../constants';
import { Page } from '../App';

interface DashboardProps {
  setPage: (page: Page) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-center text-white bg-gradient-to-br from-gray-900 to-slate-800">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-12 tracking-tight">
          Billing & Inventory System
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard
            icon={<InventoryIcon />}
            title="Inventory Management"
            description="Manage all your products — add, edit, or delete easily."
            onClick={() => setPage('inventory')}
          />
          <FeatureCard
            icon={<SalesIcon />}
            title="Sales Report"
            description="View total revenue and performance in chart form."
            onClick={() => setPage('sales')}
          />
          <FeatureCard
            icon={<BillingIcon />}
            title="Billing Section"
            description="Generate invoices and calculate totals instantly."
            onClick={() => setPage('billing')}
          />
        </div>
      </div>
    </div>
  );
};
