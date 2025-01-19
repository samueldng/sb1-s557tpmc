import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { salesService } from '../services/sales';
import { customersService } from '../services/customers';
import { productsService } from '../services/products';
import { paymentMethodsService } from '../services/payment-methods';
import { useToast } from '../context/ToastContext';
import type { Sale, Customer, Product, PaymentMethod } from '../lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SaleItem {
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface SaleFormData {
  customer_id: string;
  payment_method_id: string;
  items: SaleItem[];
  due_date?: string;
}

const Sales = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: sales, execute: loadSales } = useAsync<Sale[]>();
  const { data: customers, execute: loadCustomers } = useAsync<Customer[]>();
  const { data: products, execute: loadProducts } = useAsync<Product[]>();
  const { data: paymentMethods, execute: loadPaymentMethods } = useAsync<PaymentMethod[]>();
  
  const { addToast } = useToast();

  const [formData, setFormData] = useState<SaleFormData>({
    customer_id: '',
    payment_method_id: '',
    items: [],
  });

  useEffect(() => {
    loadSales(salesService.getAll());
    loadCustomers(customersService.getAll());
    loadProducts(productsService.getAll());
    loadPaymentMethods(paymentMethodsService.getAll());
  }, []);

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        product_id: '',
        quantity: 1,
        unit_price: 0,
        total_price: 0
      }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: keyof SaleItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      const item = { ...newItems[index] };

      if (field === 'product_id') {
        const product = products?.find(p => p.id === value);
        if (product) {
          item.product = product;
          item.unit_price = product.price;
          item.total_price = item.quantity * product.price;
        }
      } else if (field === 'quantity') {
        item.quantity = Number(value);
        item.total_price = item.quantity * item.unit_price;
      }

      newItems[index] = item as SaleItem;
      return { ...prev, items: newItems };
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + item.total_price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedPaymentMethod = paymentMethods?.find(
        pm => pm.id === formData.payment_method_id
      );

      const saleData = {
        customer_id: formData.customer_id,
        payment_method_id: formData.payment_method_id,
        total_amount: calculateTotal(),
        payment_status: selectedPaymentMethod?.requires_installments ? 'pending' : 'paid',
        due_date: formData.due_date,
      };

      const items = formData.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      await salesService.create(saleData, items);
      addToast('Venda registrada com sucesso!', 'success');
      setShowForm(false);
      setFormData({
        customer_id: '',
        payment_method_id: '',
        items: []
      });
      loadSales(salesService.getAll());
    } catch (error) {
      addToast('Erro ao registrar venda. Tente novamente.', 'error');
    }
  };

  const handleViewDetails = async (sale: Sale) => {
    try {
      const details = await salesService.getById(sale.id);
      setSelectedSale(details);
      setShowDetails(true);
    } catch (error) {
      addToast('Erro ao carregar detalhes da venda.', 'error');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredSales = sales?.filter(sale => {
    const customer = customers?.find(c => c.id === sale.customer_id);
    return customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
              placeholder="Buscar vendas por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredSales?.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {customers?.find(c => c.id === sale.customer_id)?.name}
                  </td>
                  <td className="py-3 px-4">
                    {format(new Date(sale.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </td>
                  <td className="py-3 px-4">
                    {paymentMethods?.find(pm => pm.id === sale.payment_method_id)?.name}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        sale.payment_status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : sale.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {sale.payment_status === 'paid' ? 'Pago' :
                       sale.payment_status === 'pending' ? 'Pendente' : 'Cancelado'}
                    </span>
                  </td>
                  <td className="py-3 px-4">{formatCurrency(sale.total_amount)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleViewDetails(sale)}
                        className="text-blue-600 hover:text-blue-800"
                      >
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
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Nova Venda</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente</label>
                  <select
                    required
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Selecione um cliente</option>
                    {customers?.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Forma de Pagamento
                  </label>
                  <select
                    required
                    value={formData.payment_method_id}
                    onChange={(e) => setFormData({ ...formData, payment_method_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Selecione a forma de pagamento</option>
                    {paymentMethods?.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Produtos</h3>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Produto
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5">
                        <label className="block text-sm font-medium text-gray-700">Produto</label>
                        <select
                          required
                          value={item.product_id}
                          onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Selecione um produto</option>
                          {products?.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - {formatCurrency(product.price)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Preço Unit.</label>
                        <input
                          type="text"
                          disabled
                          value={formatCurrency(item.unit_price)}
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Total</label>
                        <input
                          type="text"
                          disabled
                          value={formatCurrency(item.total_price)}
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                        />
                      </div>

                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="w-full h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {paymentMethods?.find(pm => pm.id === formData.payment_method_id)?.requires_installments && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-lg font-medium">
                    Total: {formatCurrency(calculateTotal())}
                  </p>
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

      {showDetails && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Detalhes da Venda</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-medium">
                    {customers?.find(c => c.id === selectedSale.customer_id)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-medium">
                    {format(new Date(selectedSale.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Forma de Pagamento</p>
                  <p className="font-medium">
                    {paymentMethods?.find(pm => pm.id === selectedSale.payment_method_id)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      selectedSale.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : selectedSale.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedSale.payment_status === 'paid' ? 'Pago' :
                     selectedSale.payment_status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Itens</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Produto</th>
                      <th className="text-right py-2">Qtd</th>
                      <th className="text-right py-2">Preço Unit.</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items?.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.products.name}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">{formatCurrency(item.unit_price)}</td>
                        <td className="text-right py-2">{formatCurrency(item.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right py-2 font-medium">Total:</td>
                      <td className="text-right py-2 font-medium">
                        {formatCurrency(selectedSale.total_amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {selectedSale.installments && selectedSale.installments.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Parcelas</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Vencimento</th>
                        <th className="text-right py-2">Valor</th>
                        <th className="text-right py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSale.installments.map((installment) => (
                        <tr key={installment.id} className="border-b">
                          <td className="py-2">
                            {format(new Date(installment.due_date), "dd/MM/yyyy", { locale: ptBR })}
                          </td>
                          <td className="text-right py-2">{formatCurrency(installment.amount)}</td>
                          <td className="text-right py-2">
                            <span
                              className={`px-2 py-1 text-sm rounded-full ${
                                installment.status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : installment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {installment.status === 'paid' ? 'Pago' :
                               installment.status === 'pending' ? 'Pendente' : 'Cancelado'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;