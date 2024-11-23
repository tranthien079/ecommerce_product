import React from 'react'
import { Space, Table, Tag, Popconfirm, Tooltip, Button, Typography, Image } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getSupplier, deleteSupplier } from '../../redux/supplier/supplierSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const columns = [

    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // align: 'center',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'mobile',
      key: 'mobile',
      // align: 'center',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      // align: 'center',
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

export default SupplierPage
