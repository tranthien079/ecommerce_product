import { instance } from ".";

const baseURL = "dashboard";

export const getDailyRevenueApi = async (data) => {
  const response = await instance.get(`${baseURL}/revenue/daily?${data?.startDate ? `startDate=${data?.startDate}&&` : ``}${data?.endDate ? `endDate=${data?.endDate}&&` : ``}`);
  return response;
};

export const getMonthlyRevenueApi = async (data) => {
    const response = await instance.get(`${baseURL}/revenue/monthly?${data?.startMonth ? `startMonth=${data?.startMonth}&&` : ``}${data?.endMonth ? `endMonth=${data?.endMonth}&&` : ``}`);
    return response;
};

export const getQuaterlyRevenueApi = async (data) => {
    const response = await instance.get(`${baseURL}/revenue/quaterly?${data?.startQuarter ? `startQuarter=${data?.startQuarter}&&` : ``}${data?.endQuarter ? `endQuarter=${data?.endQuarter}&&` : ``}`);
    return response;
};

export const getYearlyRevenueApi = async (year) => {
    const response = await instance.get(`${baseURL}/revenue/yearly?${year ? `year=${year}&&` : ``}`);
    return response;
};


export const getDashboardApi = async () => {
    const response = await instance.get(`${baseURL}/`);
    return response;
};