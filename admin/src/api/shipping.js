import { instance } from ".";

const baseURL = "ship";

export const getShips = async () => {
  const response = await instance.get(`${baseURL}/`);
  return response;
};

export const createShipApi = async (data) => {
  const response = await instance.post(`${baseURL}/create`, data);
  return response;
};

export const updateShipApi = async ({ id, data }) => {
  const response = await instance.put(`${baseURL}/${id}`, data);
  return response;
};

export const getShipByIdApi = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const deleteShipApi = async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);
  return response;
};
