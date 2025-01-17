import React, { useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';

const Sales = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nova Venda
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar vendas..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Cliente</th>
                <th className="text-left py-3 px-4">Data</th>
                <th className="text-left py-3 px-4">Forma de Pagamento</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-right py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((_, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Cliente {index + 1}</td>
                  <td className="py-3 px-4">2024-02-{20 + index}</td>
                  <td className="py-3 px-4">Cartão de Crédito</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                      Pago
                    </span>
                  </td>
                  <td className="py-3 px-4">R$ {(index + 1) * 1000},00</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-semibold mb-4">Nova Venda</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>Selecione um cliente</option>
                    <option>Cliente 1</option>
                    <option>Cliente 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>Selecione a forma de pagamento</option>
                    <option>Dinheiro</option>
                    <option>Cartão de Crédito</option>
                    <option>PIX</option>
                    <option>A Prazo</option>
                  </select>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Produtos</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-5">
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option>Selecione um produto</option>
                        <option>Produto 1</option>
                        <option>Produto 2</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Quantidade"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Preço"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Total"
                        disabled
                        className="block w-full rounded-md border-gray-300 bg-gray-50"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        type="button"
                        className="w-full h-full bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">Total: R$ 0,00</p>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Finalizar Venda
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;