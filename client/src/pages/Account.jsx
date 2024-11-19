import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Meta from '../components/Meta'
const Account = () => {
  const getLinkClasses = (isActive) =>
    `block px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-gray-500 text-white border border-gray-500'
        : 'text-gray-700 hover:bg-gray-100 border border-transparent'
    }`;

  return (
    <div className="container mx-auto px-4 py-4">
    <Meta title="Tài khoản" />
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/account"
              end
              className={({ isActive }) => getLinkClasses(isActive)}
            >
              Tài khoản của tôi
            </NavLink>
            <NavLink
              to="/account/orders"
              className={({ isActive }) => getLinkClasses(isActive)}
            >
              Lịch sử đơn hàng
            </NavLink>
          </nav>
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Account;