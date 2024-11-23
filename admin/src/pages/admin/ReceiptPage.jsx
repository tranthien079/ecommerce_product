import React from 'react'
import { Space, Table, Tag, Popconfirm, Tooltip, Button, Typography, Image } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getReceipt, deleteReceipt } from '../../redux/receipt/receiptSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ReceiptPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getReceipt())
  }, [])

  const receiptData = useSelector(state => state.receipts.receipts);
  const { isLoading } = useSelector(state => state.receipts);

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteReceipt(record._id)).unwrap();
      toast.success('Xóa nhập hàng thành công');
      dispatch(getReceipt());
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
      title: 'Người nhập',
      dataIndex: 'userId',
      key: 'userId',
      // align: 'center',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplierId',
      key: 'supplierId',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (totalAmount) => <span>{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>,
      // align: 'center',
    },
    {
        title: 'Ngày nhập',
        dataIndex: 'importDate',
        key: 'importDate',
        render: (importDate) => <span>{new Date(importDate).toLocaleDateString()}</span>,
        // align: 'center',
      },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`/inventory/receipt/${record._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có muốn xóa nhập hàng này?"
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
        <h3 className="font-semibold">Danh sách nhập hàng</h3>
        <Table columns={columns} bordered 
    rowKey="_id"
    size="small"
    scroll={{
      x: 1000,
    }}
    dataSource={receiptData} 
    loading={isLoading} />
      </div>
    )
}

export default ReceiptPage
