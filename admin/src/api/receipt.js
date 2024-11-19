import { instance } from ".";

const baseURL = "receipt";

export const getReceipts = async () => {
  const response = await instance.get(`${baseURL}/`);
  const result = response.map(receipt => {
    const totalAmount = receipt.receiptDetails.reduce((total, detail) => total + (detail.quantity * detail.price), 0);
    return {
      ...receipt,
      userId: receipt.userId?.firstname + ' ' + receipt.userId?.lastname,
      supplierId: receipt.supplierId?.name ?? 'null',
      totalAmount: totalAmount,
    };
  });
  return result;
};

export const createReceiptApi = async (data) => {
  const response = await instance.post(`${baseURL}/create`, data);
  return response;
};

export const updateReceiptApi = async ({ id, data }) => {
  const response = await instance.put(`${baseURL}/${id}`, data);
  return response;
};

export const getReceiptByIdApi = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  const result = {
    ...response,
    receiptDetails: response.receiptDetails.map(detail => ({
      ...detail,
      productName: detail.productId?.name || 'Unknown Product'
    }))
  };
  return result;
};

export const deleteReceiptApi = async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);
  return response;
};
