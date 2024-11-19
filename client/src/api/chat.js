import { instance } from ".";

const baseURL = "chats";

export const getUserChatsApi = async (userId) => {
  const response = await instance.get(`${baseURL}/${userId}`);
  return response;
};

export const getChatAllApi = async (data) => {
  const response = await instance.get(`${baseURL}/find/${data?.firstId}/${data?.secondId}`, data);
  return response;
};

export const createChatApi = async ({firstId, secondId}) => {
  const response = await instance.post(`${baseURL}/`,{firstId, secondId});
  return response;
};

