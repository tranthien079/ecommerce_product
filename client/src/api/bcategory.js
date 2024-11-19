import { instance } from ".";

const baseURL = "blogcategory";

export const getBlogCategoriesApi = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};
