import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const MobileHeader = ({ 
  authState, 
  cartState, 
  handleLogout, 
  query, 
  setQuery, 
  products,
  formatPrice 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <div className="flex items-center justify-between p-4">
        <Link to="/">
          <img src={assets.logo} className="w-36" alt="Logo" />
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5" alt="Cart" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1">
              {cartState?.length}
            </span>
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-4 flex justify-between items-center border-b">
            <input
              className="flex-grow p-2 border rounded-full"
              type="text"
              placeholder="Tìm kiếm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={() => setIsMenuOpen(false)} className="ml-4">
              Đóng
            </button>
          </div>

          <div className="p-4">
            {[
              { path: '/', label: 'Trang chủ' },
              { path: '/collection', label: 'Sản phẩm' },
              { path: '/about', label: 'Về chúng tôi' },
              { path: '/contact', label: 'Liên hệ' },
              { path: '/blog', label: 'Bài viết' }
            ].map(({ path, label }) => (
              <NavLink 
                key={path} 
                to={path} 
                className="block py-3 border-b"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {query && (
            <div className="p-4">
              {products.map((product) => (
                <Link 
                  key={product._id} 
                  to={`/product/${product._id}`} 
                  className="flex items-center py-2 border-b"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img src={product.images[0]?.url} className="w-10 h-10 mr-2 rounded" alt="" />
                  <div>
                    <div>{product.name}</div>
                    <div>{formatPrice(product.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="p-4">
            {authState._id ? (
              <>
                <Link to="/account" className="block py-3 border-b">Tài khoản</Link>
                <button onClick={handleLogout} className="block py-3 border-b w-full text-left">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-3 border-b">Đăng nhập</Link>
                <Link to="/register" className="block py-3 border-b">Đăng kí</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;