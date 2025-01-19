import React from 'react';
import { Search, DollarSign } from 'lucide-react';

const Debtors = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Devedores</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar devedores..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Cliente</th>
                <th className="text-left py-3 px-4">Data da Venda</th>
                <th className="text-left py-3 px-4">Data de Vencimento</th>
                <th className="text-left py-3 px-4">Valor</th>
                <th className="text-right py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((_, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Cliente {index + 1}</td>
                  <td className="py-3 px-4">2024-02-{20 + index}</td>
                  <td className="py-3 px-4">2024-03-{20 + index}</td>
                  <td className="py-3 px-4">R$ {(index + 1) * 500},00</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <button className="text-green-600 hover:text-green-800">
                        <DollarSign className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Debtors;