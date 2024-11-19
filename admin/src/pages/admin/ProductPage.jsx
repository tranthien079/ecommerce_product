import React from 'react'
import { Space, Table, Popconfirm, Button, Image } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getProduct, deleteProduct } from '../../redux/product/productSlice';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProduct())
  }, [dispatch])
  const productData = useSelector(state => state.products.products);

  const { isLoading } = useSelector(state => state.products);

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteProduct(record._id)).unwrap();
      toast.success('Xóa sản phẩm thành công');
      dispatch(getProduct());
    } catch (error) {
      console.log(error)
    }
  };

  const columns = [
    {
      title: 'Stt',
      dataIndex: '0',
      key: '0',
      render: (text, record, dataIndex) => (
        <span>{dataIndex + 1}</span>
      ),  
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      render: (images) => {
        return (
          <Image src={images[0]?.url} alt="" width={100} />
        );
      },
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId) => <span>{categoryId?.name}</span>,
    },
    {
      title: 'Thương hiệu',
      key: 'brandId',
      dataIndex: 'brandId',
      render: (brandId) => <span>{brandId?.name}</span>,
    },
    {
      title: 'Giá bán',
      key: 'price',
      dataIndex: 'price',
      render: (price) => <span>{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>,
    },
    {
      title: 'Giá giảm',
      key: 'discountPrice',
      dataIndex: 'discountPrice',
      render: (discountPrice) => <span>{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountPrice)}</span>,
    },
    {
      title: 'Đã bán',
      key: 'sold',
      dataIndex: 'sold',
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`/inventory/product/view/${record._id}`}>
          <Button className="hover:!border-yellow-400 hover:!text-yellow-400" icon={<EyeOutlined />} />
          </Link>
          <Link to={`/inventory/product/${record._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có muốn xóa sản phẩm này?"
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
      <h3 className="font-semibold">Danh sách sản phẩm</h3>
      <Table columns={columns} bordered 
        rowKey="_id"
        size="small"
        scroll={{
          x: 1000,
        }}
        dataSource={productData} 
        loading={isLoading} />
    </div>
  )
}

export default ProductPage;