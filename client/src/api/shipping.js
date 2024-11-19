import { instance } from ".";

const baseURL = "ship";

export const getShippingApi = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};
