import { instance } from ".";

const baseURL = "product";

export const getProducts = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};

export const createProductApi = async (data) => {
  const response = await instance.post(`${baseURL}/create`, data);
  return response;
};

export const updateProductApi = async ({ id, data }) => {
  const response = await instance.patch(`${baseURL}/${id}`, data);
  return response;
};

export const getProductByIdApi = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const deleteProductApi = async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);
  return response;
};

export const getReviewsApi = async () => {
  const response = await instance.get(`${baseURL}/get-review`);
  return response;
};

export const updateShowCommentApi = async (data) => {
  const response = await instance.put(`${baseURL}/show-review/${data?.productId}/${data?.commentId}`);
  return response;
};





