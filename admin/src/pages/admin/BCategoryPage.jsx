import React from 'react'
import { Space, Table, Popconfirm,  Button } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { deleteBCategory, getBCategory } from '../../redux/bcategory/bcategorySlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const BCategoryPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBCategory())
  }, [])
  const BCategoryData = useSelector(state => state.bcategories.bcategories);
  const { isLoading } = useSelector(state => state.bcategories);

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteBCategory(record._id)).unwrap();
      toast.success('Xóa chủ đề thành công');
      dispatch(getBCategory());
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
              <Link to={`/sale/bcategory/${record._id}`}>
                <Button icon={<EditOutlined />} />
              </Link>
    
              <Popconfirm
                title="Bạn có muốn xóa chủ đề này?"
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
            <h3 className="font-semibold">Danh sách chủ đề</h3>
            <Table columns={columns} bordered 
        rowKey="_id"
        size="small"
        scroll={{
          x: 1000,
        }}
        dataSource={BCategoryData} 
        loading={isLoading} />
          </div>
        )
}

export default BCategoryPage