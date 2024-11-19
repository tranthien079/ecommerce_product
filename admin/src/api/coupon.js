import { instance } from ".";

const baseURL = "coupon";

export const getCoupons = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};

export const createCouponApi = async (data) => {
  const response = await instance.post(`${baseURL}/create`, data);
  return response;
};

export const updateCouponApi = async ({ id, data }) => {
  const response = await instance.put(`${baseURL}/${id}`, data);
  return response;
};

export const getCouponByIdApi = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const deleteCouponApi = async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);
  return response;
};
