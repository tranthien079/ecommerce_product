import { instance } from ".";

const baseURL = "brand";

export const getBrands = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};

export const createBrandApi = async (data) => {
  const response = await instance.post(`${baseURL}/create`, data);
  return response;
};

export const updateBrandApi = async ({ id, data }) => {
  const response = await instance.put(`${baseURL}/${id}`, data);
  return response;
};

export const getBrandByIdApi = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const deleteBrandApi = async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);
  return response;
};

