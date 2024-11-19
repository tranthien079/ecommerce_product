import { instance } from ".";

const baseURL = "upload";


export const uploadImage = async (data) => {
  const response = await instance.post(`${baseURL}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};


export const deleteImage = async (id) => {
    const response = await instance.delete(`${baseURL}/delete-img/${id}`);
    return response;
  };

