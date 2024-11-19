import { instance } from ".";

const baseURL = "blog";

export const getBlogsApi = async (data) => {
  const response = await instance.get(`${baseURL}?categoryId=${data || ''}`);
  return response;
};

export const getBlogByIdApi = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};




