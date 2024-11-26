import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Row,
  Col,
  Table,
  Popconfirm,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createReceipt,
  resetState,
  getReceiptById,
  updateReceipt,
} from "../../redux/receipt/receiptSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProduct } from "../../redux/product/productSlice";
import { DeleteOutlined } from "@ant-design/icons";
import { getSupplier } from "../../redux/supplier/supplierSlice";
import moment from "moment";

const AddReceiptPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [skuOptions, setSkuOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSku, setSelectedSku] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getProduct());
    dispatch(getSupplier());
    if (id) {
      setIsEditing(true);
      dispatch(getReceiptById(id));
    }
  }, [dispatch, id]);

  const location = useLocation();
  const productData = useSelector((state) => state.products.products);
  const supplierData = useSelector((state) => state.suppliers.Suppliers);
  
  const newReceipt = useSelector((state) => state.receipts);
  const { isSuccess, createdReceipt, gotReceipt, updatedReceipt } = newReceipt;

  // const handleProductChange = (value) => {
  //   const selectedProduct = productData.find(
  //     (product) => product._id === value
  //   );
  //   setSelectedProduct(selectedProduct);
  //   if (selectedProduct && selectedProduct.variants) {
  //     setSkuOptions(selectedProduct.variants.map((variant) => variant.sku));
  //     setSelectedSku(selectedProduct.variants[0].sku);
  //   }
  // };
  const handleProductChange = (value) => {
    const selectedProduct = productData.find((product) => product._id === value);
    setSelectedProduct(selectedProduct);
    
    if (selectedProduct && selectedProduct.variants) {
      // Lọc những sku có stock là 0
      const zeroStockSkus = selectedProduct.variants
        .filter((variant) => variant.stock === 0)
        .map((variant) => variant.sku);
  
      setSkuOptions(zeroStockSkus);
      setSelectedSku(zeroStockSkus[0]);
    }
  };

  const handleSkuChange = (value) => {
    setSelectedSku(value);
  };

  useEffect(() => {
    if (isEditing && gotReceipt) {
      form.setFieldsValue({
        supplierId: gotReceipt.supplierId,
        importDate: moment(gotReceipt.importDate),
        userId: gotReceipt.userId,
      });
      setTableData(gotReceipt.receiptDetails.map((detail, index) => ({
        key: index + 1,
        productId: detail.productId,
        productName: detail.productName,
        productSku: detail.productSku,
        quantity: detail.quantity,
        price: detail.price,
      })));
    }
  }, [gotReceipt, isEditing, form]);

  const onFinish = (values) => {
    const newItem = {
      key: tableData.length + 1,
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      productSku: values.productSku,
      quantity: values.quantity,
      price: values.price,
    };
    setTableData((prevTableData) => [...prevTableData, newItem]);
    form.resetFields(["productId", "productSku", "quantity", "price"]);
  };

  const handleSave = () => {
    const newReceipt = {
      userId: JSON.parse(localStorage.getItem('user'))?._id,
      supplierId: form.getFieldValue("supplierId"),
      importDate: form.getFieldValue("importDate") 
      ? form.getFieldValue("importDate").isValid()
        ? form.getFieldValue("importDate").$d
        : null
      : null,
      receiptDetails: tableData
    };
    console.log(newReceipt)
    if (isEditing) {
      dispatch(updateReceipt({ id, data: newReceipt }));
    } else {
      dispatch(createReceipt(newReceipt));
    }
  };

  const handleDelete = (key) => {
    const newData = tableData.filter((item) => item.key !== key);
    setTableData(newData);
  };

  useEffect(() => {
    if (isSuccess && (createdReceipt || updatedReceipt)) {
      form.resetFields();
      setTableData([]);
      dispatch(resetState());
      toast.success(isEditing ? "Cập nhật nhập hàng thành công" : "Thêm nhập hàng thành công");
      navigate("/inventory/receipts");
    }
  }, [isSuccess, createdReceipt, updatedReceipt, navigate, dispatch, form, isEditing]);

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "SKU",
      dataIndex: "productSku",
      key: "productSku",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        tableData.length >= 1 ? (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div>
      <div className="bg-white p-5 rounded-lg ">
        <h3 className="font-semibold">
          {isEditing ? "Sửa nhập hàng" : "Thêm nhập hàng"}
        </h3>
        <Form
          form={form}
          name="addReceipt"
          onFinish={onFinish}
          initialValues={{
            layout: "vertical",
            importDate: null // Hoặc moment() nếu muốn mặc định là ngày hiện tại
          }}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="supplierId"
            label="Nhà cung cấp"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn nhà cung cấp!",
              },
            ]}
            hasFeedback
          >
            <Select
              placeholder="Chọn nhà cung cấp"
              showSearch
              optionFilterProp="label"
              options={supplierData?.map((supplier) => ({
                label: supplier.name,
                value: supplier._id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="importDate"
            label="Ngày nhập"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày nhập!",
              },
              {
                validator: (_, value) => {
                  if (value && moment(value).isAfter(moment(), 'day')) {
                    return Promise.reject('Ngày nhập không được lớn hơn ngày hiện tại!');
                  }
                  return Promise.resolve();
                },
              },
            ]}
            hasFeedback
          >
            <DatePicker
              style={{
                width: "100%",
              }}
              placeholder="Chọn ngày nhập"
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > moment().endOf('day')}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productId"
                label="Sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn sản phẩm!",
                  },
                ]}
                hasFeedback
              >
                <Select
                  placeholder="Chọn sản phẩm"
                  showSearch
                  optionFilterProp="label"
                  onChange={handleProductChange}
                  options={productData.map((product) => ({
                    label: product.name,
                    value: product._id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productSku"
                label="Mã SKU sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn mã sku sản phẩm!",
                  },
                ]}
                hasFeedback
              >
                <Select
                  placeholder="Chọn mã sku sản phẩm"
                  value={selectedSku}
                  showSearch
                  optionFilterProp="label"
                  onChange={handleSkuChange}
                  options={skuOptions.map((sku) => ({
                    label: sku,
                    value: sku,
                  }))}
                  disabled={!selectedProduct}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng!",
                  },
                ]}
              >
                <InputNumber
                   min={1} 
                   step={1} 
                   precision={0}
                placeholder="Nhập số lượng"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá!",
                  },
                ]}
              >
                <InputNumber
                  min={1} 
                  step={1} 
                  precision={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  style={{
                    width: "100%",
                  }}
                  placeholder="Nhập giá nhập hàng"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </Button>
          </Form.Item>
        </Form>

        <Table columns={columns} dataSource={tableData} />

        <div style={{ marginTop: "20px" }}>
          <h4>JSON của bảng:</h4>
          <pre>{JSON.stringify(tableData, null, 2)}</pre>
        </div>

        <Button
          type="primary"
          onClick={handleSave}
          style={{ marginTop: "20px" }}
        >
          {isEditing ? "Cập nhật phiếu nhập hàng" : "Lưu phiếu nhập hàng"}
        </Button>
      </div>
    </div>
  );
};

export default AddReceiptPage;
