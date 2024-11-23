import React from 'react'
import { Space, Table, Popconfirm, Tooltip, Button, Image } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getBlog, deleteBlog } from '../../redux/blog/blogSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const BlogPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBlog())
  }, [])
  const blogData = useSelector(state => state.blogs.blogs);
  const { isLoading } = useSelector(state => state.blogs);

  const handleDelete = (record) => {
    dispatch(deleteBlog(record._id))
      .unwrap()
      .then(() => {
        dispatch(getBlog());
        toast.success("Xóa bài viết thành công")
      })
      .catch((error) => {
        console.error('Failed to delete blog:', error);
      });
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author_name',
      key: 'author_name',
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
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>

          <Link to={`/sale/blog/${record._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>

          <Popconfirm
            title="Bạn có muốn xóa bài viết này?"
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
      <h3 className="font-semibold">Danh sách bài viết</h3>
      <Table columns={columns}  bordered dataSource={blogData} 
        rowKey={"_id"}
        size="small"
        scroll={{
          x: 1000,
        }}
        loading={isLoading}
      />
    </div>
  )
}

export default BlogPage;
