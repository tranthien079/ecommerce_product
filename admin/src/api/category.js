import { instance } from ".";

const baseURL = "category";

export const getCategories = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};

export const createCategoryApi = async (data) => {
  const response = await instance.post(`${baseURL}/create`, data);
  return response;
};

export const updateCategoryApi = async ({ id, data }) => {
  const response = await instance.put(`${baseURL}/${id}`, data);
  return response;
};


export const getCategoryByIdApi = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const deleteCategoryApi = async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);
  return response;
};