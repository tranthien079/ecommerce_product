import { instance } from ".";

const baseURL = "supplier";

export const getSuppliers = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};

export const createSupplierApi = async (data) => {
  const response = await instance.post(`${baseURL}/create`, data);
  return response;
};

export const updateSupplierApi = async ({ id, data }) => {
  const response = await instance.put(`${baseURL}/${id}`, data);
  return response;
};

export const getSupplierByIdApi = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const deleteSupplierApi = async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);
  return response;
};
