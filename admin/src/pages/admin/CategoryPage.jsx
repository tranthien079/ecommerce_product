import React from 'react'
import { Space, Table, Popconfirm, Tooltip, Button } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getCategory, deleteCategory } from '../../redux/category/categorySlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CategoryPage = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategory())
  }, [])

  const categoryData = useSelector(state => state.categories.categories);
  const { isLoading } = useSelector(state => state.categories);

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteCategory(record._id)).unwrap();
      toast.success('Xóa thương hiệu thành công');
      dispatch(getCategory());
    } catch (error) {
      console.log(error)
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
          <Link to={`/sale/category/${record._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có muốn xóa danh mục này?"
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
        <h3 className="font-semibold">Danh sách danh mục sản phẩm</h3>
        <Table columns={columns} bordered 
    rowKey="_id"
    size="small"
    scroll={{
      x: 1000,
    }}
    dataSource={categoryData} 
    loading={isLoading} />
      </div>
    )
}

export default CategoryPage