import React, { useRef, useState } from 'react'
import { Space, Table, Tag, Popconfirm, Tooltip, Button, Typography, Image, Input, DatePicker } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getReceipt, deleteReceipt, updateReceipt } from '../../redux/receipt/receiptSlice';
import { EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';

const ReceiptPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getReceipt())
  }, [])

  const receiptData = useSelector(state => state.receipts.receipts);
  const { isLoading } = useSelector(state => state.receipts);

  const handleDelete = async (record) => {
    try {
      await dispatch(updateReceipt(record._id)).unwrap();
      toast.success('Hủy nhập hàng thành công');
      dispatch(getReceipt());
    } catch (error) {
      console.log(error)
    }
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

    const getColumnSearchPropsDate = (dataIndex) => {
      return {
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <DatePicker.RangePicker
              style={{ width: "100%", marginBottom: 8 }}
              value={
                selectedKeys[0]
                  ? [dayjs(selectedKeys[0][0]), dayjs(selectedKeys[0][1])]
                  : null
              }
              onChange={(dates) => {
                if (dates) {
                  setSelectedKeys([
                    [
                      dates[0].startOf("day").toISOString(),
                      dates[1].endOf("day").toISOString(),
                    ],
                  ]);
                } else {
                  setSelectedKeys([]);
                }
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  confirm();
                }}
                style={{ width: 90 }}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => confirm()}
                style={{ width: 90 }}
              >
                Ok
              </button>
            </div>
          </div>
        ),
        onFilter: (value, record) => {
          if (!value || !record[dataIndex]) return false;
  
          const recordDate = dayjs(record[dataIndex]);
          const [startDate, endDate] = value;
  
          return recordDate.isAfter(startDate) && recordDate.isBefore(endDate);
        },
        filterIcon: (filtered) => (
          <span style={{ color: filtered ? "#1890ff" : undefined }}>🗓</span>
        ),
      };
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
      ...getColumnSearchProps('userId')
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplierId',
      key: 'supplierId',
      ...getColumnSearchProps('supplierId')
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
        ...getColumnSearchPropsDate('importDate')
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        // align: 'center',
        ...getColumnSearchProps('status'),
        render: (_, record) => (
          <Space>
            {
              record?.status !== "Đã hủy" ? (<Popconfirm
                title="Bạn có muốn hủy nhập hàng này?"
                onConfirm={() => handleDelete(record)}
                okText="Xác nhận"
                cancelText="Hủy bỏ"
              >
                  <Button type="primary" > Hủy phiếu
              </Button>
              </Popconfirm>) : record?.status
            }
          </Space>
        ),
      },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`/inventory/receipt/${record._id}`}>
            <Button
              className="hover:!border-yellow-400 hover:!text-yellow-400"
              icon={<EyeOutlined />}
            />
          </Link>
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
