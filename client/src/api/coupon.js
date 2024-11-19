import { instance } from ".";

const baseURL = "user";

export const applyCouponApi = async (data) => {
  const response = await instance.post(`${baseURL}/checkout/applycoupon`, data);
  return response;
};






