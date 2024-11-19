import { instance } from ".";

const baseURL = "brand";

export const getBrandsApi = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};
