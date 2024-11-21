import { instance } from ".";

const baseURL = "user";

export const registerApi = async (data) => {
  const response = await instance.post(`${baseURL}/register`, data);
  return response;
};

export const verifyEmailApi = async (data) => {
  const response = await instance.post(`${baseURL}/verify-email`, data);
  return response;
};

export const loginApi = async (data) => {
  const response = await instance.post(`${baseURL}/login`, data);
  return response;
};

export const updateUserInfoApi = async (data) => {
  const response = await instance.put(`${baseURL}/edit-user`, data);
  return response;
};

export const getWishlistApi = async (data) => {
  const response = await instance.get(`${baseURL}/wishlist`, data);
  return response;
};

export const addToCartApi = async (data) => {
  const response = await instance.post(`${baseURL}/cart`, data);
  return response;
};

export const getCartApi = async () => {
  const response = await instance.get(`${baseURL}/cart`);
  return response;
};

export const removeProductApi = async (cartId) => {
  const response = await instance.delete(`${baseURL}/delete-product-cart/${cartId}`);
  return response;
};

export const updateProductApi = async ({cartId, newQuantity}) => {
  const response = await instance.put(`${baseURL}/update-product-cart/${cartId}/${newQuantity}`);
  return response;
};

export const createOrderApi = async (data) => {
  const response = await instance.post(`${baseURL}/cart/create-order`, data);
  return response;
};

export const repaymentApi = async (data) => {
  const response = await instance.post(`${baseURL}/repayment`, data);
  return response;
};

export const getUserOrderApi = async () => {
  const response = await instance.get(`${baseURL}/get-user-orders`);
  return response;
};

export const getOrderDetailApi = async (id) => {
  const response = await instance.get(`${baseURL}/get-user-orders/${id}`);
  return response;
};

export const forgotPasswordApi = async (email) => {
  const response = await instance.post(`${baseURL}/forgot-password-token`, email);
  return response;
};

export const changePasswordByTokenApi = async (data) => {
  const response = await instance.put(`${baseURL}/reset-password/${data?.token}`, {password: data?.password});
  return response;
};

export const updatePaymentStatusApi = async (data) => {
  const response = await instance.get(`${baseURL}/checkout/payment-online/${data}`);
  return response;
};

export const getUsersApi = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};

export const findUserApi = async (userId) => {
  const response = await instance.get(`${baseURL}/find/${userId}`);
  return response;
};

export const updateOrderStatusApi = async (data) => {
  const response = await instance.put(`${baseURL}/update-order/${data?.id}`, { status: data?.status }); 
  return response;
}
