import React from 'react'
import { Space, Table, Tag, Popconfirm, Tooltip, Button, Typography, Image } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getShip, deleteShip } from '../../redux/shipping/shippingSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShippingPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getShip())
  }, [])

  const shipData = useSelector(state => state.ships.ships);
  const { isLoading } = useSelector(state => state.ships);

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteShip(record._id)).unwrap();
      toast.success('Xóa đơn vị vận chuyển thành công');
      dispatch(getShip());
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
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>,
      // align: 'center',
    },
    
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`/sale/ship/${record._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có muốn xóa đơn vị vận chuyển này?"
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
        <h3 className="font-semibold">Danh sách đơn vị vận chuyển</h3>
        <Table columns={columns} bordered 
    rowKey="_id"
    size="small"
    scroll={{
      x: 1000,
    }}
    dataSource={shipData} 
    loading={isLoading} />
      </div>
    )
}

export default ShippingPage
