import React from "react";
import {
  Space,
  Table,
  Tag,
  Popconfirm,
  Tooltip,
  Button,
  Typography,
  Image,
  Input,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { blockUser, getUser, unBlockUser } from "../../redux/customer/customerSlice";
import { LockOutlined, UnlockOutlined, DeleteOutlined, SearchOutlined,EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { deleteUser } from "../../redux/auth/authSlice";
import Highlighter from "react-highlight-words";
import { useRef } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom'
const UserPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, []);
  const customerData = useSelector((state) => state.customers.customers);
  const { isLoading } = useSelector((state) => state.customers);

  const handleBlockUser = async (record) => {
    try {
      await dispatch(blockUser(record));
      toast.success("Khóa người dùng thành công");
      await dispatch(getUser());
    } catch (error) {
      toast.error(error.message );
    }
  }

  const handleUnBlockUser = async (record) => {
    try {
    await dispatch(unBlockUser(record));
    toast.success("Mở khóa người dùng thành công");
    await dispatch(getUser());
  } catch (error) {
    toast.error(error.message );
  }
  }

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteUser(record._id)).unwrap();
      toast.success('Xóa người dùng thành công');
      dispatch(getUser());
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa người dùng thành công');
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
      title: "Họ đệm",
      dataIndex: "firstname",
      key: "firstname",
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps('firstname'),
    },
    {
      title: "Tên",
      dataIndex: "lastname",
      key: "lastname",
      ...getColumnSearchProps('lastname'),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps('email'),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps('address'),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      ...getColumnSearchProps('mobile'),
    },
    {
      title: "Vai trò",
      key: "role",
      dataIndex: "role",
    
      filters: [
        {
          text: 'Nhân viên bán hàng',
          value: 'sale',
        },
        {
          text: 'Nhân viên kho',
          value: 'inventory',
        },
        {
          text: 'Quản lý',
          value: 'admin',
        },
        {
          text: 'Khách hàng',
          value: 'user',
        },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.role.startsWith(value),
      render: (role) => {
        const tagColor = role === "admin" ? "geekblue" : "volcano";
        return (
          <Tag color={tagColor}>
            <Typography.Text>{role.toUpperCase()}</Typography.Text>
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      // fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          {record?.isActive == true ? (
            <Button type="primary" icon={<LockOutlined />} danger onClick={() => handleBlockUser(record?._id)} />
          ) : (
            <Button icon={<UnlockOutlined />} onClick={() => handleUnBlockUser(record?._id)}/>
          )}
             <Popconfirm
            title="Bạn có muốn xóa đơn vị vận chuyển này?"
            onConfirm={() => handleDelete(record)}
            okText="Xác nhận"
            cancelText="Hủy bỏ"
          >
              <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
          <Link to={`/admin/user/${record?._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-10 rounded-lg">
      <h3 className="font-semibold">Danh sách khách hàng</h3>
      <Table
        columns={columns}
        bordered
        dataSource={customerData}
        rowKey={"_id"}
        size="small"
        scroll={{
          x: 1000,
        }}
        loading={isLoading}
      />
    </div>
  );
};

export default UserPage;
