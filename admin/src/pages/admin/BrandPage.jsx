import React from 'react'
import { Space, Table, Tag, Popconfirm, Tooltip, Button, Typography, Image } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getBrand, resetState, deleteBrand } from '../../redux/brand/brandSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

const BrandPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBrand())
  }, [])

  const brandData = useSelector(state => state.brands.brands);
  const { isLoading } = useSelector(state => state.brands);

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteBrand(record._id)).unwrap();
      toast.success('Xóa thương hiệu thành công');
      dispatch(getBrand());
    } catch (error) {
      console.log(error)
    }
  };
  const columns = [
    {
      title: 'Tên thương hiệu',
      dataIndex: 'name',
      key: 'name',
      // align: 'center',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      // align: 'center',
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>

          <Link to={`/sale/brand/${record._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có muốn xóa thương hiệu này?"
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
      <h3 className="font-semibold">Danh sách thương hiệu</h3>
      <Table columns={columns} bordered
        rowKey="_id"
        size="small"
        scroll={{
          x: 1000,
        }}
        dataSource={brandData}
        loading={isLoading} />
    </div>
  )
}

export default BrandPage
