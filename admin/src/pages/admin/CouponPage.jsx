import React from 'react'
import { Space, Table, Tag, Popconfirm, Tooltip, Button, Typography, Image } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getCoupon, deleteCoupon } from '../../redux/coupon/couponSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CouponPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCoupon())
  }, [])

  const couponData = useSelector(state => state.coupons.coupons);
  const { isLoading } = useSelector(state => state.coupons);

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteCoupon(record._id)).unwrap();
      toast.success('Xóa mã giảm giá thành công');
      dispatch(getCoupon());
    } catch (error) {
      console.log(error)
    }
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      // align: 'center',
      render: (text) => <a>{text}</a>,
    },  
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // align: 'center',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiry',
      key: 'expiry',
      render: (expiry) => <span>{new Date(expiry).toLocaleDateString()}</span>,
    },
    {
      title: 'Số lượng mã',
      dataIndex: 'quantity',
      key: 'quantity',
      // align: 'center',
    },
    {
      title: 'Đã dùng',
      dataIndex: 'usedQuanity',
      key: 'usedQuanity',
      // align: 'center',
    },
    {
      title: 'Phần trăm khuyến mãi',
      dataIndex: 'discount',
      key: 'discount',
      // align: 'center',
    },
    
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`/sale/coupon/${record._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có muốn xóa mã giảm giá này?"
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
        <h3 className="font-semibold">Danh sách mã giảm giá</h3>
        <Table columns={columns} bordered 
    rowKey="_id"
    size="small"
    scroll={{
      x: 1000,
    }}
    dataSource={couponData} 
    loading={isLoading} />
      </div>
    )
}

export default CouponPage