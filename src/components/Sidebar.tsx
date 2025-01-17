import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  FolderOpen,
  ShoppingCart,
  AlertCircle,
} from 'lucide-react';

const Sidebar = () => {
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Painel' },
    { to: '/customers', icon: Users, label: 'Clientes' },
    { to: '/products', icon: Package, label: 'Produtos' },
    { to: '/categories', icon: FolderOpen, label: 'Categorias' },
    { to: '/sales', icon: ShoppingCart, label: 'Vendas' },
    { to: '/debtors', icon: AlertCircle, label: 'Devedores' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Sistema de Vendas</h1>
      </div>
      <nav className="mt-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
              }`
            }
          >
            <link.icon className="w-5 h-5 mr-3" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;