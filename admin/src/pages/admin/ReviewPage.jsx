import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReview, updateReview } from "../../redux/review/reviewSlice";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import { Table, Button, Space, Rate, Input } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, SearchOutlined } from "@ant-design/icons";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import Highlighter from "react-highlight-words";
import { useRef } from "react";
  
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const ReviewPage = () => {
  const dispatch = useDispatch();
  const reviewData = useSelector((state) => state.reviews.reviews);
  const { isLoading } = useSelector((state) => state.reviews);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    dispatch(getReview());
  }, [dispatch]);



  useEffect(() => {
    if (reviewData.length > 0) {
      const productMap = {};

      // Calculate average stars for each product
      reviewData.forEach((review) => {
        const { productId, productName, star } = review;
        if (!productMap[productId]) {
          productMap[productId] = { name: productName, totalStars: 0, count: 0 };
        }
        productMap[productId].totalStars += star;
        productMap[productId].count++;
      });

      const labels = [];
      const averageStars = [];

      for (const productId in productMap) {
        labels.push(productMap[productId].name);
        const averageStar = (
          productMap[productId].totalStars / productMap[productId].count
        ).toFixed(2);
        averageStars.push(averageStar);
      }

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Trung bình số sao",
            data: averageStars,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    }
  }, [reviewData]);

  const handleIsShow = async (record) => {
    try {
      const data = {
        productId: record?.productId,
        commentId: record?.commentId,
      };
      await dispatch(updateReview(data));
      toast.success("Cập nhật trạng thái hiển thị thành công");
      dispatch(getReview());
    } catch (error) {
      toast.error(error.message || "Cập nhật trạng thái hiển thị không thành công");
    }
  };

      //search table for keywords
      const [searchText, setSearchText] = useState('');
      const [searchedColumn, setSearchedColumn] = useState('');
      const searchInput = useRef(null);
   
      const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
      };
    
      const getColumnSearchProps = (dataIndex) => ({
       filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
         <div
           style={{
             padding: 8,
           }}
           onKeyDown={(e) => e.stopPropagation()}
         >
           <Input
             ref={searchInput}
             placeholder={`Search ${dataIndex}`}
             value={selectedKeys[0]}
             onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
             onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
             style={{
               marginBottom: 8,
               display: 'block',
             }}
           />
           <Space>
             <Button
               type="primary"
               onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
               icon={<SearchOutlined />}
               size="small"
               style={{
                 width: 90,
               }}
             >
               Search
             </Button>
             <Button
               onClick={() => clearFilters && handleReset(clearFilters)}
               size="small"
               style={{
                 width: 90,
               }}
             >
               Reset
             </Button>
           </Space>
         </div>
       ),
       filterIcon: (filtered) => (
         <SearchOutlined
           style={{
             color: filtered ? '#1677ff' : undefined,
           }}
         />
       ),
       onFilter: (value, record) =>
         record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
       onFilterDropdownOpenChange: (visible) => {
         if (visible) {
           setTimeout(() => searchInput.current?.select(), 100);
         }
       },
       render: (text) =>
         searchedColumn === dataIndex ? (
           <Highlighter
             highlightStyle={{
               backgroundColor: '#ffc069',
               padding: 0,
             }}
             searchWords={[searchText]}
             autoEscape
             textToHighlight={text ? text.toString() : ''}
           />
         ) : (
           text
         ),
     });
  

  const columns = [
    {
      title: "Người đánh giá",
      dataIndex: "userId",
      key: "userId",
      render: (userId) => <span>{userId?.firstname} {userId?.lastname}</span>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Sao đánh giá",
      dataIndex: "star",
      key: "star",
      filters: [
        { text: '⭐', value: 1 },
        { text: '⭐⭐', value: 2 },
        { text: '⭐⭐⭐', value: 3 },
        { text: '⭐⭐⭐⭐', value: 4 },
        { text: '⭐⭐⭐⭐⭐', value: 5 },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.star === value, // Convert `value` to number for comparison
      render: (star) => <Rate allowHalf disabled defaultValue={star} />,
    },
    {
      title: "Đánh giá",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          {record?.isShow ? (
            <Button
              type="primary"
              icon={<EyeInvisibleOutlined />}
              danger
              onClick={() => handleIsShow(record)}
            />
          ) : (
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleIsShow(record)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-10 rounded-lg">
      <h3 className="font-semibold">Danh sách đánh giá</h3>
      <Table
        columns={columns}
        bordered
        rowKey="commentId"
        size="small"
        dataSource={Array.isArray(reviewData) && reviewData }
        loading={isLoading}
      />
      <h3 className="font-semibold mt-5">Biểu đồ trung bình số sao của sản phẩm</h3>
      {chartData.labels && chartData.labels.length > 0 ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            indexAxis: "y", // Makes the chart horizontal
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Sản phẩm và trung bình số sao",
              },
            },
          }}
        />
      ) : (
        <p>Không có dữ liệu để hiển thị biểu đồ.</p>
      )}
    </div>
  );
};

export default ReviewPage;
