import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  getUserCart, updatePaymentStatus } from '../redux/user/userSlice';
import Meta from '../components/Meta';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const updateOrder = async () => {
      const queryParams = new URLSearchParams(location.search);
      const orderId = queryParams.get('orderId');
      const paymentStatus = queryParams.get('status');
      const orderCode = queryParams.get('orderCode');
      const resultCode = queryParams.get('resultCode');

      if (resultCode === '0' && orderId) {
        await dispatch(updatePaymentStatus(orderId));
        await dispatch(getUserCart());
      }
      // Uncomment and modify this if necessary
      if(paymentStatus === 'PAID' && orderCode) {
        await dispatch(updatePaymentStatus(orderCode));
        await dispatch(getUserCart());
      }
    };

    updateOrder();
  }, [dispatch, location.search]); 

  return (
<div className="max-w-md mx-auto bg-white p-20 rounded-lg shadow-md text-center">
<Meta title="Thanh toán thành công" />

  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className="w-6 h-6"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
      />
    </svg>
  </div>
  
  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
    Thanh toán đơn hàng thành công
  </h2>
  
  <p className="text-gray-600 mb-6">
    Đơn hàng của quý khách sẽ được xác nhận trong thời gian sớm nhất. Bạn có thể hủy đơn hàng trong vòng 1h kể từ khi đặt hàng.
  </p>
  
  <a 
    href="/account/orders" 
    className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-200"
  >
    Lịch sử đơn hàng
  </a>
</div>
  );
};

export default PaymentSuccess;
