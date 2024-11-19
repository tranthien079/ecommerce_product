import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const DesktopHeader = ({ 
  authState, 
  cartState, 
  handleLogout, 
  query, 
  setQuery, 
  products, 
  formatPrice 
}) => {
  return (
    <div className="hidden sm:flex items-center justify-between py-5 font-medium px-4">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Logo" />
      </Link>

      <ul className="flex gap-5 text-sm text-gray-700">
        {[
          { path: '/', label: 'HOME' },
          { path: '/collection', label: 'SẢN PHẨM' },
          { path: '/about', label: 'VỀ CHÚNG TÔI' },
          { path: '/contact', label: 'LIÊN HỆ' },
          { path: '/blog', label: 'BÀI VIẾT' }
        ].map(({ path, label }) => (
          <NavLink 
            key={path} 
            to={path} 
            className="flex flex-col items-center gap-1"
          >
            <p>{label}</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        <div className="relative inline-flex items-center border border-gray-400 px-5 py-2 rounded-full">
          <input
            className="outline-none bg-inherit text-sm"
            type="text"
            placeholder="Tìm kiếm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>

          {query && (
            <ul className="absolute top-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-10 w-full">
              {products.map((product) => (
                <li key={product._id} className="p-2 hover:bg-gray-100">
                  <Link to={`/product/${product._id}`}>
                    <div className="flex items-center">
                      <img src={product.images[0]?.url} className="w-10 h-10 mr-2 rounded" alt="" />
                      <div>
                        <div>{product.name}</div>
                        <div>{formatPrice(product.price)}</div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {authState._id ? (
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1">
                {cartState?.length}
              </span>
            </Link>
            <Link to="/account">
            </Link>
            <button onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng kí</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopHeader;