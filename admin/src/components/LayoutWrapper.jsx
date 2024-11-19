import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
const AdminRoute = () => {
  const userType = useSelector((state) => state?.auth?.user?.role);
  
  return userType === 'admin' ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const SaleRoute = () => {
  const userType = useSelector((state) => state?.auth?.user?.role);
  
  return userType === 'sale' ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

const InventoryRoute = () => {
  const userType = useSelector((state) => state?.auth?.user?.role);
  
  return userType === 'inventory' ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export { AdminRoute, SaleRoute, InventoryRoute };
