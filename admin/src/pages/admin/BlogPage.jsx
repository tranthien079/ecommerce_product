import React, { useRef, useState } from 'react'
import { Space, Table, Popconfirm, Tooltip, Button, Image, Input } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getBlog, deleteBlog } from '../../redux/blog/blogSlice';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Highlighter from 'react-highlight-words';

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
      ...getColumnSearchProps('author_name'),
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
