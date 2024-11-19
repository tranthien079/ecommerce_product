import React, { useEffect, useState, useRef } from 'react';
import { Space, Table, Tooltip, Button, Select, Input, Tag, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, updateOrderStatus } from '../../redux/order/orderSlice';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Highlighter from "react-highlight-words";
import momo from "../../../public/images/momo.webp";
import payos from "../../../public/images/payos.svg";
const OrderPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  const orderData = useSelector(state => state.orders.orders);
  const { isLoading } = useSelector(state => state.orders);

  const handleUpdateOrder = async (value, orderId) => {
    const data = {
      id: orderId,
      status: value,
    };
   await dispatch(updateOrderStatus(data));
   toast.success('Cập nhật trạng thái đơn hàng thành công')
   await dispatch(getOrder());
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
      title: 'Khách hàng',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (user_name) => (
        <span>{user_name}</span>
      ),
      ...getColumnSearchProps('user_name'),

    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      render: (employee_name) => (
        <span>{employee_name && employee_name !== 'undefined undefined' ? employee_name : ''}</span>
      ),
      ...getColumnSearchProps('employee_name'),

    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentInfo',
      key: 'paymentInfo',
      filters: [
        {
          text: 'PayOs',
          value: 'payos',
        },
        {
          text: 'Momo',
          value: 'momo',
        },
        {
          text: 'Thanh toán khi nhận hàng',
          value: 'cash',
        },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.paymentInfo.startsWith(value),
      render: (paymentInfo) => {
        const tagColor = paymentInfo === 'cash' 
        ? 'https://png.pngtree.com/png-clipart/20210530/original/pngtree-cash-payments-for-cod-with-hand-holding-money-and-box-png-image_6373958.jpg' 
        : paymentInfo === 'momo' 
        ? momo
        : payos;
        return (
            <img src={tagColor} alt="" width={50} />
        );
      },
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus) => {
        const tagColor = paymentStatus === 'Chưa thanh toán' 
        ? 'red' 
        : 'success';
        return (
          <Tag color={tagColor}>
            <Typography.Text>
              {paymentStatus.toUpperCase()}
            </Typography.Text>
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      filters: [
        {
          text: 'Chờ xác nhận',
          value: 'Chờ xác nhận',
        },
        {
          text: 'Đã xác nhận',
          value: 'Đã xác nhận',
        },
        {
          text: 'Đang giao',
          value: 'Đang giao',
        },
        {
          text: 'Hoàn thành',
          value: 'Hoàn thành',
        },
        {
          text: 'Đã hủy',
          value: 'Đã hủy',
        },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.orderStatus.startsWith(value),
      render: (orderStatus, record) => (
        <Select
          value={orderStatus}
          style={{ width: 150 }}
          onChange={(value) => handleUpdateOrder(value, record._id)} 
          options={[
            { value: 'Chờ xác nhận', label: 'Chờ xác nhận' },
            { value: 'Đã xác nhận', label: 'Đã xác nhận' },
            { value: 'Đang giao', label: 'Đang giao' },
            { value: 'Hoàn thành', label: 'Hoàn thành' },
            { value: 'Đã hủy', label: 'Đã hủy' },
          ]}
        />
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => {
        return (
          <span>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
          </span>
        );
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`/sale/order/${record._id}`}> {/* Add a link to the order details page */}
            <Button className="hover:!border-yellow-400 hover:!text-yellow-400" icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className='bg-white p-10 rounded-lg'>
      <h3 className="font-semibold">Danh sách đơn hàng</h3>
      <Table
        columns={columns}
        bordered
        dataSource={orderData}
        rowKey={"_id"}
        size="small"
        scroll={{ x: 1000 }}
        loading={isLoading}
      />
    </div>
  );
};

export default OrderPage;
