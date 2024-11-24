import React, { useRef, useState } from "react";
import {
  Space,
  Table,
  Popconfirm,
  Button,
  Image,
  Input,
  Typography,
  Tag,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProduct, deleteProduct } from "../../redux/product/productSlice";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Highlighter from "react-highlight-words";
import { getCategory } from "../../redux/category/categorySlice";
import { getBrand } from "../../redux/brand/brandSlice";

const ProductPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getDataProduct = async () => {
      try {
        await Promise.all([
          dispatch(getProduct()),
          dispatch(getCategory()),
          dispatch(getBrand()),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getDataProduct();
  }, [dispatch]);
  const productData = useSelector((state) => state.products.products);
  const categoryData = useSelector((state) => state.categories.categories);
  const brandData = useSelector((state) => state.brands.brands);

  const { isLoading } = useSelector((state) => state.products);

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteProduct(record._id)).unwrap();
      toast.success("Xóa sản phẩm thành công");
      dispatch(getProduct());
    } catch (error) {
      console.log(error);
    }
  };

  //search table for keywords
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
          color: filtered ? "#1677ff" : undefined,
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
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const getFilterColumn = ({ title, dataIndex, data }) => ({
    title: title,
    dataIndex: dataIndex,
    key: dataIndex,
    filters: data.map((item) => ({
      text: item.name,
      value: item._id,
    })),
    filterMode: "tree",
    filterSearch: true,
    onFilter: (value, record) => record[dataIndex]?._id === value,
    render: (item) => <Typography.Text>{item?.name}</Typography.Text>,
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "0",
      key: "0",
      render: (text, record, dataIndex) => <span>{dataIndex + 1}</span>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => {
        return <Image src={images[0]?.url} alt="" width={100} />;
      },
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) => <span>{categoryId?.name}</span>,
      ...getFilterColumn({
        title: "Danh mục",
        dataIndex: "categoryId",
        data: categoryData,
      }),
    },
    {
      title: "Thương hiệu",
      key: "brandId",
      dataIndex: "brandId",
      render: (brandId) => <span>{brandId?.name}</span>,
      ...getFilterColumn({
        title: "Thương hiệu",
        dataIndex: "brandId",
        data: brandData,
      }),
    },
    {
      title: "Giá bán",
      key: "price",
      dataIndex: "price",
      render: (price) => (
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </span>
      ),
    },
    {
      title: "Giá giảm",
      key: "discountPrice",
      dataIndex: "discountPrice",
      render: (discountPrice) => (
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(discountPrice)}
        </span>
      ),
    },
    {
      title: "Đã bán",
      key: "sold",
      dataIndex: "sold",
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`/inventory/product/view/${record._id}`}>
            <Button
              className="hover:!border-yellow-400 hover:!text-yellow-400"
              icon={<EyeOutlined />}
            />
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
    <div className="bg-white p-10 rounded-lg">
      <h3 className="font-semibold">Danh sách sản phẩm</h3>
      <Table
        columns={columns}
        bordered
        rowKey="_id"
        size="small"
        scroll={{
          x: 1000,
        }}
        dataSource={productData}
        loading={isLoading}
      />
    </div>
  );
};

export default ProductPage;
