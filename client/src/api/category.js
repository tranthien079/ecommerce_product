import { instance } from ".";

const baseURL = "category";

export const getCategoriesApi = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};
