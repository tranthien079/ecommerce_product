import { instance } from ".";

const baseURL = "user";

export const getUsers = async () => {
  const response = await instance.get(`${baseURL}/all-users`);
  return response;
};

export const blockUserApi = async (id) => {
  const response = await instance.put(`${baseURL}/block-user/${id}`);
  return response;
};

export const unBlockUserApi = async (id) => {
  const response = await instance.put(`${baseURL}/unblock-user/${id}`);
  return response;
};
