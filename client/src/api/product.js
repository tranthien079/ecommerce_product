import { instance } from ".";

const baseURL = "product";

// export const getProductsApi = async (data) => {
//   const response = await instance.get(`${baseURL}?${data?.brandId ? `brandId=${data?.brandId}&&` : ``}${data?.categoryId ? `categoryId=${data?.categoryId}&&` : ``}${data?.minPrice ? `price[gte]=${data?.minPrice}&&` : ``}${data?.maxPrice ? `price[lte]=${data?.maxPrice}&&` : ``}${data?.sort ? `sort=${data?.sort}&&` : ``}`);
//   return response;
// };

export const getProductsApi = async (data) => {

  const queryParams = [];

  if (data?.brandId) queryParams.push(`brandId=${data.brandId}`);
  if (data?.categoryId) queryParams.push(`categoryId=${data.categoryId}`);
  if (data?.minPrice) queryParams.push(`price[gte]=${data.minPrice}`);
  if (data?.maxPrice) queryParams.push(`price[lte]=${data.maxPrice}`);
  if (data?.sort) queryParams.push(`sort=${data.sort}`);
  
  if (data?.page) queryParams.push(`page=${data.page}`);
  // if (data?.limit) queryParams.push(`limit=${data.limit || 8} `);
  queryParams.push(`limit=${data.limit || 12} `);


  // Nối các điều kiện lọc lại bằng dấu &
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

  const response = await instance.get(`${baseURL}${queryString}`);
  return response;
};

export const addToWishListApi = async (productId) => {
  const response = await instance.put(`${baseURL}/wishlist`, {productId});
  return response;
};

export const getProductByIdApi = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);
  return response;
};

export const ratingProductApi = async (data) => {
  const response = await instance.put(`${baseURL}/rating`, data);
  return response;
}

export const relatedProductApi = async (data) => {
  const response = await instance.get(`${baseURL}/related/${data?.productId}/${data?.categoryId}`);
  return response;
}



