import { instance } from ".";

const baseURL = "blogcategory";

export const getBCategories = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};

export const createBCategoryApi = async (data) => {
  const response = await instance.post(`${baseURL}/create`, data);
  return response;
};

export const updateBCategoryApi = async ({ id, data }) => {
  const response = await instance.put(`${baseURL}/${id}`, data);
  return response;
};


export const getBCategoryByIdApi = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const deleteBCategoryApi = async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);
  return response;
};