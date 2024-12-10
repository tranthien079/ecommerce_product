import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js"; 
import { useDispatch, useSelector } from "react-redux";
import {
  getDailyRevenue,
  getDashboard,
  getMonthlyRevenue,
  getQuaterlyRevenue,
  getYearlyRevenue,
} from "../../redux/dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import { Button, DatePicker, Space, Tag, Typography, Table } from "antd";
import { EyeOutlined,DownloadOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import * as XLSX from "xlsx";
const { RangePicker } = DatePicker;

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const dispatch = useDispatch();

  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedMonthRange, setSelectedMonthRange] = useState(null);
  const [selectedQuarterRange, setSelectedQuarterRange] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const today = new Date();
  const currentDay = today.toISOString().split("T")[0];
  const currentMonth = dayjs().format('YYYY-MM');
  const currentYear = today.getFullYear();

  const dashboardState = useSelector((state) => state?.dashboard);
  const orderData = dashboardState?.dashboard.recentOrders;

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getDailyRevenue({ startDate: currentDay, endDate: currentDay }));
    dispatch(getMonthlyRevenue({ startMonth: currentDay, endMonth: currentDay }));
    dispatch(getYearlyRevenue(currentYear));
  }, [dispatch]);

  const handleDateChange = (dates) => {
    setSelectedDateRange(dates);

  };

  const handleMonthChange =  (dates) => {
    setSelectedMonthRange(dates);
  };

  const handleQuarterChange = (dates) => {
    setSelectedQuarterRange(dates);
  };
  useEffect(() => {
    if (selectedDateRange && selectedDateRange.length === 2) {
      const startDate = selectedDateRange[0].toISOString();
      const endDate = selectedDateRange[1].toISOString();
      dispatch(getDailyRevenue({ startDate, endDate }));
    } else {
      dispatch(getDailyRevenue({ startDate: currentDay, endDate: currentDay }));
    }
  }, [selectedDateRange, dispatch]);

  
  useEffect(() => {
    if (selectedMonthRange && selectedMonthRange.length === 2) {
      const startMonth = selectedMonthRange[0].toISOString();
      const endMonth = selectedMonthRange[1].toISOString();
      dispatch(getMonthlyRevenue({ startMonth, endMonth }));
    } else {
      dispatch(getMonthlyRevenue({ startMonth: currentMonth, endMonth: currentMonth }));
    }
  }, [selectedMonthRange, dispatch]);

  useEffect(() => {
    if (selectedQuarterRange && selectedQuarterRange.length === 2) {
      const startQuarter = selectedQuarterRange[0].toISOString();
      const endQuarter = selectedQuarterRange[1].toISOString();
      dispatch(getQuaterlyRevenue({ startQuarter, endQuarter }));
    } 
  }, [selectedQuarterRange, dispatch]);
  // useEffect(() => {
  //   if (selectedMonth) {
  //     const month = selectedMonth.month() + 1;
  //     const year = selectedMonth.year();
  //     dispatch(getMonthlyRevenue({ month, year }));
  //   } else {
  //     dispatch(getMonthlyRevenue({ month: currentMonth, year: currentYear }));
  //   }
  // }, [selectedMonth, dispatch]);

  useEffect(() => {
    if (selectedYear) {
      const year = selectedYear.year();
      dispatch(getYearlyRevenue(year));
    } else {
      dispatch(getYearlyRevenue(currentYear));
    }
  }, [selectedYear, dispatch]);

  const dailyStatistics = dashboardState?.dailyRevenue?.dailyRevenue?.map((item) => ({
    date: item.date,
    totalRevenue: item.totalRevenue || 0,
  })) || [];

  const monthlyStatistics = dashboardState?.monthlyRevenue?.monthlyRevenue?.map((item) => ({
    date: item.date,
    totalRevenue: item.totalRevenue || 0,
  })) || [];

  const quarterlyStatistics = dashboardState?.quarterlyRevenue?.quarterlyRevenue?.map((item) => ({
    date: item.date,
    totalRevenue: item.totalRevenue || 0,
  })) || [];

  const dailyChartData = {
    labels: dailyStatistics.map(item => `${item.date}`),
    datasets: [
      {
        label: "Doanh thu",
        data: dailyStatistics.map(item => item.totalRevenue),
        backgroundColor: "rgba(41, 137, 255, 0.5)",
        borderColor: "#2989FF",
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyStatistics.map(item => `${item.date}`),
    datasets: [
      {
        label: "Doanh thu",
        data: monthlyStatistics.map(item => item.totalRevenue),
        backgroundColor: "rgba(41, 137, 255, 0.5)",
        borderColor: "#2989FF",
        borderWidth: 1,
      },
    ],
  };

  const quarterlyChartData = {
    labels: quarterlyStatistics.map(item => `${item.date}`),
    datasets: [
      {
        label: "Doanh thu",
        data: quarterlyStatistics.map(item => item.totalRevenue),
        backgroundColor: "rgba(41, 137, 255, 0.5)",
        borderColor: "#2989FF",
        borderWidth: 1,
      },
    ],
  };

  const yearlyStatistics = {
    labels: dashboardState?.yearlyRevenue?.monthlyRevenue?.map(item => item.month) || [],
    datasets: [
      {
        label: "Doanh thu",
        data: dashboardState?.yearlyRevenue?.monthlyRevenue?.map(item => item.totalRevenue || 0) || [],
        backgroundColor: "rgba(41, 137, 255, 0.5)",
        borderColor: "#2989FF",
        borderWidth: 1,
      },
    ],
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistics_revenue");
  
    // Generate Excel file and download
    XLSX.writeFile(workbook, "Statistics_revenue_report.xlsx");
  };



  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "userId",
      key: "userId",
      render: (userId) => (
        <span>
          {userId?.firstname} {userId?.lastname}
        </span>
      ),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentInfo",
      key: "paymentInfo",
      filters: [
        {
          text: "Paypal",
          value: "paypal",
        },
        {
          text: "Momo",
          value: "momo",
        },
        {
          text: "Cash",
          value: "cash",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.paymentInfo.startsWith(value),
      render: (paymentInfo) => {
        const tagColor =
          paymentInfo === "momo"
            ? "red"
            : paymentInfo === "paypal"
            ? "processing"
            : "success";
        return (
          <Tag color={tagColor}>
            <Typography.Text>{paymentInfo.toUpperCase()}</Typography.Text>
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      filters: [
        {
          text: "Chờ xác nhận",
          value: "Chờ xác nhận",
        },
        {
          text: "Đã xác nhận",
          value: "Đã xác nhận",
        },
        {
          text: "Đang giao",
          value: "Đang giao",
        },
        {
          text: "Hoàn thành",
          value: "Hoàn thành",
        },
        {
          text: "Đã hủy",
          value: "Đã hủy",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.orderStatus.startsWith(value),
      render: (orderStatus, record) => (
        <Tag
          color={
            record.orderStatus === "Hoàn thành"
              ? "success"
              : record.orderStatus === "Đã hủy"
              ? "red"
              : "processing"
          }
        >
          <Typography.Text>{record.orderStatus.toUpperCase()}</Typography.Text>
        </Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => {
        return (
          <span>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalPrice)}
          </span>
        );
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const today = new Date();

        const isToday =
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear();

        return (
          <span>
            {date.toLocaleString()} {isToday && "(Hôm nay)"}
          </span>
        );
      },
    },
  ];

  return (
    <>
     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div className="widget-item bg-white p-6 flex justify-between rounded-md">
          <div>
            <h4 className="text-2xl  font-semibold text-slate-700 mb-2 leading-none">
              {dashboardState?.dashboard?.blogCount}
            </h4>
            <p className="text-xl leading-4 font-bold ">Bài viết</p>
            <div className="badge space-x-1">
              {" "}
              <svg
                width="12"
                height="12"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1V18C1 19.66 2.34 21 4 21H21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M4 16L8.59 10.64C9.35 9.76001 10.7 9.7 11.52 10.53L12.47 11.48C13.29 12.3 14.64 12.25 15.4 11.37L20 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 bg-success">
              <svg
                width="20"
                height="20"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.37 7.87988H16.62"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M5.38 7.87988L6.13 8.62988L8.38 6.37988"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M11.37 14.8799H16.62"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M5.38 14.8799L6.13 15.6299L8.38 13.3799"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M8 21H14C19 21 21 19 21 14V8C21 3 19 1 14 1H8C3 1 1 3 1 8V14C1 19 3 21 8 21Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
        </div>
        <div className="widget-item bg-white p-6 flex justify-between rounded-md">
          <div>
            <h4 className="text-2xl  font-semibold text-slate-700 mb-2 leading-none">
              {dashboardState?.dashboard?.productCount}
            </h4>
            <p className="text-xl leading-4 font-bold ">Sản phẩm</p>
            <div className="badge space-x-1 text-purple bg-purple/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 512.001 512.001"
                width="12"
                height="12"
              >
                <path
                  fill="currentColor"
                  d="M506.35,80.699c-7.57-7.589-19.834-7.609-27.43-0.052L331.662,227.31l-42.557-42.557c-7.577-7.57-19.846-7.577-27.423,0 L89.076,357.36c-7.577,7.57-7.577,19.853,0,27.423c3.782,3.788,8.747,5.682,13.712,5.682c4.958,0,9.93-1.894,13.711-5.682 l158.895-158.888l42.531,42.524c7.57,7.57,19.808,7.577,27.397,0.032l160.97-160.323 C513.881,100.571,513.907,88.288,506.35,80.699z"
                ></path>
                <path
                  fill="currentColor"
                  d="M491.96,449.94H38.788V42.667c0-10.712-8.682-19.394-19.394-19.394S0,31.955,0,42.667v426.667 c0,10.712,8.682,19.394,19.394,19.394H491.96c10.712,0,19.394-8.682,19.394-19.394C511.354,458.622,502.672,449.94,491.96,449.94z"
                ></path>
                <path
                  fill="currentColor"
                  d="M492.606,74.344H347.152c-10.712,0-19.394,8.682-19.394,19.394s8.682,19.394,19.394,19.394h126.061v126.067 c0,10.705,8.682,19.394,19.394,19.394S512,249.904,512,239.192V93.738C512,83.026,503.318,74.344,492.606,74.344z"
                ></path>
              </svg>
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 bg-purple">
              <svg
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 21H19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M3.59998 7.37988H2C1.45 7.37988 1 7.82988 1 8.37988V16.9999C1 17.5499 1.45 17.9999 2 17.9999H3.59998C4.14998 17.9999 4.59998 17.5499 4.59998 16.9999V8.37988C4.59998 7.82988 4.14998 7.37988 3.59998 7.37988Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M10.7999 4.18994H9.19995C8.64995 4.18994 8.19995 4.63994 8.19995 5.18994V16.9999C8.19995 17.5499 8.64995 17.9999 9.19995 17.9999H10.7999C11.3499 17.9999 11.7999 17.5499 11.7999 16.9999V5.18994C11.7999 4.63994 11.3499 4.18994 10.7999 4.18994Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M17.9999 1H16.3999C15.8499 1 15.3999 1.45 15.3999 2V17C15.3999 17.55 15.8499 18 16.3999 18H17.9999C18.5499 18 18.9999 17.55 18.9999 17V2C18.9999 1.45 18.5499 1 17.9999 1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
        </div>
        <div className="widget-item bg-white p-6 flex justify-between rounded-md">
          <div>
            <h4 className="text-2xl  font-semibold text-slate-700 mb-2 leading-none">
              {dashboardState?.dashboard?.userCount}
            </h4>
            <p className="text-xl leading-4 font-bold ">Khách hàng</p>
            <div className="badge space-x-1 text-info bg-info/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 512.001 512.001"
                width="12"
                height="12"
              >
                <path
                  fill="currentColor"
                  d="M506.35,80.699c-7.57-7.589-19.834-7.609-27.43-0.052L331.662,227.31l-42.557-42.557c-7.577-7.57-19.846-7.577-27.423,0 L89.076,357.36c-7.577,7.57-7.577,19.853,0,27.423c3.782,3.788,8.747,5.682,13.712,5.682c4.958,0,9.93-1.894,13.711-5.682 l158.895-158.888l42.531,42.524c7.57,7.57,19.808,7.577,27.397,0.032l160.97-160.323 C513.881,100.571,513.907,88.288,506.35,80.699z"
                ></path>
                <path
                  fill="currentColor"
                  d="M491.96,449.94H38.788V42.667c0-10.712-8.682-19.394-19.394-19.394S0,31.955,0,42.667v426.667 c0,10.712,8.682,19.394,19.394,19.394H491.96c10.712,0,19.394-8.682,19.394-19.394C511.354,458.622,502.672,449.94,491.96,449.94z"
                ></path>
                <path
                  fill="currentColor"
                  d="M492.606,74.344H347.152c-10.712,0-19.394,8.682-19.394,19.394s8.682,19.394,19.394,19.394h126.061v126.067 c0,10.705,8.682,19.394,19.394,19.394S512,249.904,512,239.192V93.738C512,83.026,503.318,74.344,492.606,74.344z"
                ></path>
              </svg>
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 bg-info">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 6.16C16.94 6.15 16.87 6.15 16.81 6.16C15.43 6.11 14.33 4.98 14.33 3.58C14.33 2.15 15.48 1 16.91 1C18.34 1 19.49 2.16 19.49 3.58C19.48 4.98 18.38 6.11 17 6.16Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M15.9699 13.44C17.3399 13.67 18.8499 13.43 19.9099 12.72C21.3199 11.78 21.3199 10.24 19.9099 9.30004C18.8399 8.59004 17.3099 8.35003 15.9399 8.59003"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M4.96998 6.16C5.02998 6.15 5.09998 6.15 5.15998 6.16C6.53998 6.11 7.63998 4.98 7.63998 3.58C7.63998 2.15 6.48998 1 5.05998 1C3.62998 1 2.47998 2.16 2.47998 3.58C2.48998 4.98 3.58998 6.11 4.96998 6.16Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M5.99994 13.44C4.62994 13.67 3.11994 13.43 2.05994 12.72C0.649941 11.78 0.649941 10.24 2.05994 9.30004C3.12994 8.59004 4.65994 8.35003 6.02994 8.59003"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M11 13.63C10.94 13.62 10.87 13.62 10.81 13.63C9.42996 13.58 8.32996 12.45 8.32996 11.05C8.32996 9.61997 9.47995 8.46997 10.91 8.46997C12.34 8.46997 13.49 9.62997 13.49 11.05C13.48 12.45 12.38 13.59 11 13.63Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M8.08997 16.78C6.67997 17.72 6.67997 19.26 8.08997 20.2C9.68997 21.27 12.31 21.27 13.91 20.2C15.32 19.26 15.32 17.72 13.91 16.78C12.32 15.72 9.68997 15.72 8.08997 16.78Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
        </div>
        <div className="widget-item bg-white p-6 flex justify-between rounded-md">
          <div>
            <h4 className="text-2xl  font-semibold text-slate-700 mb-2 leading-none">
              {dashboardState?.dashboard?.pendingOrderCount || 0}
            </h4>
            <p className="text-xl leading-4 font-bold ">Đơn chờ xác nhận</p>
            <div className="badge space-x-1 text-warning bg-warning/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 512.001 512.001"
                width="12"
                height="12"
              >
                <path
                  fill="currentColor"
                  d="M506.35,80.699c-7.57-7.589-19.834-7.609-27.43-0.052L331.662,227.31l-42.557-42.557c-7.577-7.57-19.846-7.577-27.423,0 L89.076,357.36c-7.577,7.57-7.577,19.853,0,27.423c3.782,3.788,8.747,5.682,13.712,5.682c4.958,0,9.93-1.894,13.711-5.682 l158.895-158.888l42.531,42.524c7.57,7.57,19.808,7.577,27.397,0.032l160.97-160.323 C513.881,100.571,513.907,88.288,506.35,80.699z"
                ></path>
                <path
                  fill="currentColor"
                  d="M491.96,449.94H38.788V42.667c0-10.712-8.682-19.394-19.394-19.394S0,31.955,0,42.667v426.667 c0,10.712,8.682,19.394,19.394,19.394H491.96c10.712,0,19.394-8.682,19.394-19.394C511.354,458.622,502.672,449.94,491.96,449.94z"
                ></path>
                <path
                  fill="currentColor"
                  d="M492.606,74.344H347.152c-10.712,0-19.394,8.682-19.394,19.394s8.682,19.394,19.394,19.394h126.061v126.067 c0,10.705,8.682,19.394,19.394,19.394S512,249.904,512,239.192V93.738C512,83.026,503.318,74.344,492.606,74.344z"
                ></path>
              </svg>
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 bg-warning">
              <svg
                width="23"
                height="22"
                viewBox="0 0 23 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.17004 6.43994L11 11.5499L19.77 6.46991"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M11 20.6099V11.5399"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M20.61 8.17V13.83C20.61 13.88 20.61 13.92 20.6 13.97C19.9 13.36 19 13 18 13C17.06 13 16.19 13.33 15.5 13.88C14.58 14.61 14 15.74 14 17C14 17.75 14.21 18.46 14.58 19.06C14.67 19.22 14.78 19.37 14.9 19.51L13.07 20.52C11.93 21.16 10.07 21.16 8.92999 20.52L3.59 17.56C2.38 16.89 1.39001 15.21 1.39001 13.83V8.17C1.39001 6.79 2.38 5.11002 3.59 4.44002L8.92999 1.48C10.07 0.84 11.93 0.84 13.07 1.48L18.41 4.44002C19.62 5.11002 20.61 6.79 20.61 8.17Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M22 17C22 18.2 21.47 19.27 20.64 20C19.93 20.62 19.01 21 18 21C15.79 21 14 19.21 14 17C14 15.74 14.58 14.61 15.5 13.88C16.19 13.33 17.06 13 18 13C20.21 13 22 14.79 22 17Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M18.25 15.75V17.25L17 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="bg-white p-8 col-span-12 xl:col-span-12 2xl:col-span-12 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold tracking-wide text-slate-700 text-2xl  mb-0 leading-none ">
              Đơn đặt hàng gần đây
            </h3>
            <Link
              to="/admin/orders"
              href="order-list.html"
              className="leading-none text-base text-info border-b border-info border-dotted capitalize font-medium hover:text-info/60 hover:border-info/60"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="overflow-scroll 2xl:overflow-visible">
            <div className="w-[700px] 2xl:w-full">
              <Table
                columns={columns}
                bordered
                dataSource={orderData}
                rowKey={"_id"}
                size="small"
                scroll={{ x: 1000 }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="bg-white p-8 col-span-12 xl:col-span-12 2xl:col-span-6 rounded-md">
          <div className="text-center text-xl font-bold mb-4">
            Thống kê doanh thu theo ngày{" "}
            <RangePicker
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              locale={locale}
              className="ml-2.5"
            />
                <button onClick={() => exportToExcel(dailyStatistics)} className="ml-2 p-0.5 text-sm bg-blue-500 text-white rounded">
                  Export Excel
          </button>
          </div>
          <Bar data={dailyChartData} options={{ responsive: true }} />
      
        </div>
        <div className="bg-white p-8 col-span-12 xl:col-span-12 2xl:col-span-6 rounded-md">
          <div className="text-center text-xl font-bold mb-4">
            Thống kê doanh theo tháng{" "}
            <RangePicker 
              locale={locale}
              picker="month"
              className="ml-2.5"
              onChange={handleMonthChange}
            />
            <button onClick={() => exportToExcel(monthlyStatistics)} className="ml-2 p-0.5 text-sm bg-blue-500 text-white rounded">
                  Export Excel
          </button>
          </div>
          
          <Bar data={monthlyChartData} options={{ responsive: true }} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 mb-6">
      <div className="bg-white p-8 col-span-6 xl:col-span-6 2xl:col-span-6 rounded-md">
          <div className="text-center text-xl font-bold mb-4">
            Thống kê doanh thu theo năm{" "}
            <DatePicker
              picker="year"
              locale={locale}
              className="ml-2.5"
              onChange={(date) => setSelectedYear(date)}
            />
            <button onClick={() => exportToExcel(yearlyStatistics)} className="ml-2 p-0.5 text-sm bg-blue-500 text-white rounded">
                  Export Excel
          </button>
          </div>
          <Bar data={yearlyStatistics} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-8 col-span-6 xl:col-span-6 2xl:col-span-6 rounded-md">
          <div className="text-center text-xl font-bold mb-4">
            Thống kê doanh thu theo quý{" "}
            <RangePicker
              picker="quarter"
              locale={locale}
              className="ml-2.5"
              onChange={handleQuarterChange}
            />
               <button onClick={() => exportToExcel(quarterlyStatistics)} className="ml-2 p-0.5 text-sm bg-blue-500 text-white rounded">
                  Export Excel
          </button>
          </div>
          <Bar data={quarterlyChartData} options={{ responsive: true }} />
        </div>
      </div>
     
     
    </>
  );
};

export default DashboardPage;
