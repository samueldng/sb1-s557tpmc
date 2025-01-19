import React, { useEffect } from 'react';
import { DollarSign, ShoppingBag, AlertCircle, TrendingUp } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { dashboardService } from '../services/dashboard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard = () => {
  const { data: totalSales, execute: executeTotalSales } = useAsync<number>();
  const { data: totalProfit, execute: executeTotalProfit } = useAsync<number>();
  const { data: totalProducts, execute: executeTotalProducts } = useAsync<number>();
  const { data: totalReceivables, execute: executeTotalReceivables } = useAsync<number>();
  const { data: recentSales, execute: executeRecentSales } = useAsync<any[]>();
  const { data: topProducts, execute: executeTopProducts } = useAsync<any[]>();

  useEffect(() => {
    executeTotalSales(dashboardService.getTotalSales());
    executeTotalProfit(dashboardService.getTotalProfit());
    executeTotalProducts(dashboardService.getTotalProducts());
    executeTotalReceivables(dashboardService.getTotalReceivables());
    executeRecentSales(dashboardService.getRecentSales());
    executeTopProducts(dashboardService.getTopProducts());
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Painel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalSales || 0)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lucro Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalProfit || 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produtos Vendidos</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalProducts || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">A Receber</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalReceivables || 0)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Vendas Recentes</h2>
          <div className="space-y-4">
            {recentSales?.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{sale.customers.name}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(sale.created_at), "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(sale.total_amount)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Produtos Mais Vendidos</h2>
          <div className="space-y-4">
            {topProducts?.map((item) => (
              <div key={item.products.name} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{item.products.name}</p>
                  <p className="text-sm text-gray-600">{item.quantity} unidades vendidas</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.total_price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;