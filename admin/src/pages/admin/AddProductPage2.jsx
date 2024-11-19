import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  InputNumber,
  Space,
  Upload,
  message
} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MinusCircleOutlined, PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getBrand } from '../../redux/brand/brandSlice';
import { getCategory } from '../../redux/category/categorySlice';
import { uploadImages, deteleImage } from '../../redux/upload/uploadSlice';
import { toast } from "react-toastify";
import Dropzone from 'react-dropzone'
import { createProduct, resetState } from "../../redux/product/productSlice";
import { useNavigate } from 'react-router-dom'

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Option } = Select;
  const [form] = Form.useForm();


  useEffect(() => {
    dispatch(getBrand());
    dispatch(getCategory());
  }, [dispatch]);

  const brandState = useSelector((state) => state.brands.brands);
  const categoryState = useSelector((state) => state.categories.categories);
  const imgState = useSelector((state) => state.images.images);
  const newProduct = useSelector((state) => state.products);
  const { isSuccess, isError, isLoading, createdProduct } = newProduct;
  const onFinish = (values) => {
    const data = { ...values, images: imgState };
    dispatch(createProduct(data));
  };

  useEffect(() => {
    if (isSuccess && createdProduct) {
      form.resetFields();
      toast.success('Thêm sản phẩm thành công');
    
      navigate('/admin/products');

    }
  }, [isSuccess, isError, isLoading, navigate, createdProduct, form]);


  return (
    <div>
      <div className="bg-white p-5 rounded-lg">
        <h3 className="font-semibold">Thêm sản phẩm</h3>
        <Form
          form={form}
          name="add-product"
          onFinish={onFinish}
          initialValues={{
            layout: "vertical",
            prefix: "86",
          }}
          layout="vertical"
          scrollToFirstError
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên sản phẩm!",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá gốc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá gốc!",
                  },
                ]}
                hasFeedback
              >
                <Space
                  direction="vertical"
                  style={{
                    width: "100%",
                  }}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                  />
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discountPrice"
                label="Giá khuyến mãi"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const originalPrice = getFieldValue("price");
                      if (!value || value < originalPrice) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Giá khuyến mãi không được lớn hơn hoặc bằng giá gốc!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Space
                  direction="vertical"
                  style={{
                    width: "100%",
                  }}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                  />
                </Space>
              </Form.Item>
            </Col>
          </Row> 
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Danh mục sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn danh mục!",
                  },
                ]}
                hasFeedback
              >
                <Select
                  showSearch
                  placeholder="Chọn thương hiệu"
                  optionFilterProp="label"
                  options={
                    categoryState && categoryState.map((b) => ({
                      value: b._id,
                      label: b.name,
                    }))
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brandId"
                label="Thương hiệu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thương hiệu!",
                  },
                ]}
                hasFeedback
              >
                <Select
                  showSearch
                  placeholder="Chọn thương hiệu"
                  optionFilterProp="label"
                  options={
                    brandState && brandState.map((b) => ({
                      value: b._id,
                      label: b.name,
                    }))
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
              >
                <ReactQuill theme="snow" />
              </Form.Item>
            </Col>
          </Row>
          <Form.List
            name="variants"
            // rules={[
            //   {
            //     validator: async (_, variants) => {
            //       if (!variants || variants.length < 1) {
            //         return Promise.reject(new Error('Thêm ít nhất 1 sản phẩm biến thể'));
            //       }
            //     },
            //   },
            // ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <div key={key}>
                    <Form.Item
                      label={index === 0 ? "Sản phẩm biến thể" : ""}
                      required={false}
                      key={key}
                    >
                      <Row gutter={16}>
                        <Col span={7}>
                          <Form.Item
                            {...restField}
                            name={[name, "size"]}
                            validateTrigger={["onChange", "onBlur"]}
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "Vui lòng nhập kích cỡ!",
                              },
                            ]}
                          >
                            <Input placeholder="Size" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "color"]}
                            validateTrigger={["onChange", "onBlur"]}
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "Vui lòng nhập màu!",
                              },
                            ]}
                          >
                            <Input placeholder="Color" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "sku"]}
                            validateTrigger={["onChange", "onBlur"]}
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "Vui lòng nhập SKU!",
                              },
                            ]}
                          >
                            <Input placeholder="SKU" />
                          </Form.Item>
                        </Col>
                        <Col span={1}>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => remove(name)}
                              style={{ marginLeft: "10px" }}
                            />
                          ) : null}
                        </Col>
                      </Row>
                    </Form.Item>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "25%" }}
                    icon={<PlusOutlined />}
                  >
                    Thêm biến thể
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Row gutter={16}>
            <Col span={24}>
              <div className="bg-white text-center border-2">
                <Dropzone onDrop={acceptedFiles => {
                  dispatch(uploadImages(acceptedFiles));
                }}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p className="p-12">Drag 'n' drop some files here, or click to select files</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
              <div className="show-img flex gap-3">
                {imgState?.length > 0 ? (
                  imgState.map((img, index) => (
                    <div key={index} className="mt-2 relative">
                      <button
                        type="button"
                        className="btn-close absolute text-3xl right-0 top-0 text-white"
                        onClick={() => dispatch(deteleImage(img.public_id))}
                      >
                        <CloseCircleOutlined />
                      </button>
                      <img src={img.url} alt="product" height={150} width={150}  />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có hình ảnh nào được thêm!</p>
                )}
              </div>
            </Col>
          </Row>
          <Form.Item>
            <Button type="" className="mt-3" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddProductPage;
