import { instance } from ".";

const baseURL = "user";

export const loginAdmin = async (body) => {
  const response = await instance.post(`${baseURL}/admin-login`, body);
  return response;
};

export const createUserApi = async (body) => {
  const response = await instance.post(`${baseURL}/register`, body);
  return response;
};

export const getOrders = async () => {
  const response = await instance.get(`${baseURL}/get-all-orders`);
  const result = response.map(order => ({
          ...order,
          user_name: order?.userId?.firstname + " " + order?.userId?.lastname,
          employee_name: order?.employeeId ? order?.employeeId?.firstname + " " + order?.employeeId?.lastname : '' ,
        }));
  return result;
}

export const updateOrderStatusApi = async (data) => {
  const response = await instance.put(`${baseURL}/update-order/${data?.id}`, { status: data?.status }); 
  return response;
}

export const getOrderDetailApi = async (id) => {
  const response = await instance.get(`${baseURL}/get-user-orders/${id}`);
  return response;
};

export const getUsersApi = async () => {
  const response = await instance.get(`${baseURL}/get-all-user`);
  return response;
};

export const findUserApi = async (userId) => {
  const response = await instance.get(`${baseURL}/find/${userId}`);
  return response;
};

export const deleteUserApi =  async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);
  return response;
};

export const updateUserApi =  async (data) => {
  const response = await instance.put(`${baseURL}/update/${data?.userId}`, data?.data);
  return response;
};

