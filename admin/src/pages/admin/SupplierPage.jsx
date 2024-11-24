import React, { useRef, useState } from 'react'
import { Space, Table, Tag, Popconfirm, Tooltip, Button, Typography, Image, Input } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getSupplier, deleteSupplier } from '../../redux/supplier/supplierSlice';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Highlighter from 'react-highlight-words';

const SupplierPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSupplier())
  }, [])

  const supplierData = useSelector(state => state.suppliers.Suppliers);
  const { isLoading } = useSelector(state => state.suppliers);

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteSupplier(record._id)).unwrap();
      toast.success('Xóa nhà cung cấp thành công');
      dispatch(getSupplier());
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa nhà cung cấp');
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
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      // align: 'center',
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email')

    },
    {
      title: 'Số điện thoại',
      dataIndex: 'mobile',
      key: 'mobile',
      // align: 'center',
      ...getColumnSearchProps('mobile')

    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      // align: 'center',
      ...getColumnSearchProps('address')

    },
    
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`/inventory/supplier/${record._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có muốn xóa nhà cung cấp này?"
            onConfirm={() => handleDelete(record)}
            okText="Xác nhận"
            cancelText="Hủy bỏ"
          >
              <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];
 
    return (
      <div className='bg-white p-10 rounded-lg'>
        <h3 className="font-semibold">Danh sách nhà cung cấp</h3>
        <Table columns={columns} bordered 
    rowKey="_id"
    size="small"
    scroll={{
      x: 1000,
    }}
    dataSource={supplierData} 
    loading={isLoading} />
      </div>
    )
}

export default SupplierPage;
