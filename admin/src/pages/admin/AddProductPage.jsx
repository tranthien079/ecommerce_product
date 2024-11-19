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
  message,
  Spin,
} from "antd";
import ReactQuill from "react-quill";
import { ColorPicker } from "antd";
import "react-quill/dist/quill.snow.css";
import {
  MinusCircleOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getBrand } from "../../redux/brand/brandSlice";
import { getCategory } from "../../redux/category/categorySlice";
import { uploadImages, deteleImage } from "../../redux/upload/uploadSlice";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import {
  createProduct,
  updateProduct,
  getProductById,
  resetState,
} from "../../redux/product/productSlice";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [existingImages, setExistingImages] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
  ]);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    } else {
      form.setFieldsValue({
        variants: [{ size: "", color: "#000000", sku: "" }], // Default variant
      });
    }
    dispatch(getBrand());
    dispatch(getCategory());
  }, [dispatch, id, form]);

  const brandState = useSelector((state) => state.brands.brands);
  const categoryState = useSelector((state) => state.categories.categories);
  const imgState = useSelector((state) => state.images);
  const newProduct = useSelector((state) => state.products);
  const {
    isSuccess,
    isError,
    isLoading,
    createdProduct,
    updatedProduct,
    gotProduct,
  } = newProduct;

  useEffect(() => {
    if (id && gotProduct) {
      form.setFieldsValue({
        name: gotProduct.name,
        price: gotProduct.price,
        discountPrice: gotProduct.discountPrice,
        categoryId: gotProduct?.categoryId?._id,
        brandId: gotProduct?.brandId?._id,
        description: gotProduct.description,
        variants: gotProduct.variants.map((v) => ({
          size: v.size,
          color: v.color,
          colorCode: v.colorCode,
          sku: v.sku,
          stock: v.stock
        })),
      });
      setExistingImages(gotProduct?.images || []);
    }
  }, [form, id, gotProduct]);

  // const onFinish = (values) => {
  //   const images = [...existingImages, ...imgState?.images];
  //   if (id) {
  //     const data = { ...values, images };
  //     console.log(data);
  //     dispatch(updateProduct({ id, data: data }));
  //   } else {
  //     const variants = [];
  //     values.variants.forEach((variant) => {
  //       const { sizes, color, sku } = variant;
  //       sizes.forEach((size) => {
  //         variants.push({ size, color, sku });
  //       });
  //     });

  //     const data = { ...values, variants, images };
  //     dispatch(createProduct(data));
  //   }
  // };
  const onFinish = (values) => {
    const images = [...existingImages, ...imgState?.images];
    if (id) {
      const data = { ...values, images };
      console.log(data)

      dispatch(updateProduct({ id, data: data }));
    } else {
      const variants = [];
      values.variants.forEach((variant) => {
        const { sizes, color, sku, colorCode } = variant;
        sizes.forEach((size) => {
          const colorInitials = colorCode
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .join('');
          const newSku = `${sku}-${colorInitials}-${size}`;
            variants.push({
            size,
            color,
            colorCode,
            sku: newSku,
          });
        });
      });
  
      const data = { ...values, variants, images };
      dispatch(createProduct(data));
    }
  };

  useEffect(() => {
    if (isSuccess && (createdProduct || updatedProduct)) {
      form.resetFields();
      toast.success(
        id ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công"
      );
      dispatch(resetState());
      navigate("/inventory/products");
    }
  }, [
    isSuccess,
    isError,
    isLoading,
    navigate,
    createdProduct,
    updatedProduct,
    form,
    dispatch,
    id,
  ]);

  const handleSizeChange = (value) => {
    // Không cần xử lý gì trong hàm này, chỉ cần để cho select hoạt động
  };

  const handleAddSize = (value) => {
    if (value && !sizeOptions.some((option) => option.value === value)) {
      setSizeOptions([...sizeOptions, { value, label: value }]);
    }
  };

  const handleRemoveImage = (public_id) => {
    dispatch(deteleImage(public_id));
    setExistingImages(
      existingImages.filter((img) => img.public_id !== public_id)
    );
  };

  return (
    <div>
      <div className="bg-white p-5 rounded-lg">
        <h3 className="font-semibold">
          {id ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        </h3>
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
                <Input placeholder="Nhập tên sản phẩm"/>
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
             <InputNumber
                style={{ width: "100%" }}
                min={1} 
                step={1} 
                precision={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Nhập giá gốc"
              />
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
                hasFeedback
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1} 
                  step={1} 
                  precision={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Nhập giá khuyến mãi"
                />
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
                  placeholder="Chọn danh mục"
                  optionFilterProp="label"
                  options={
                    categoryState &&
                    categoryState.map((b) => ({
                      value: b._id,
                      label: b?.name,
                    }))
                  }
                  value={form.getFieldValue("categoryId")}
                  onChange={(value) => form.setFieldsValue({ categoryId: value })} 
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
                    brandState &&
                    brandState.map((b) => ({
                      value: b._id,
                      label: b?.name,
                    }))
                  }
                  value={form.getFieldValue("brandId")} 
                  onChange={(value) => form.setFieldsValue({ brandId: value })} 
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
          <Form.List name="variants">
  {(fields, { add, remove }, { errors }) => (
    <>
      {fields.map(({ key, name, fieldKey, ...restField }, index) => (
        <div key={key}>
          <Form.Item label={index === 0 ? "Sản phẩm biến thể" : ""}>
            <Row gutter={16}>
              <Col span={5}>
                <Form.Item
                  {...restField}
                  name={id ? [name, 'size'] : [name, 'sizes']}
                  validateTrigger={["onChange", "onBlur"]}
                  hasFeedback
                  rules={[{ required: true, message: "Vui lòng chọn kích cỡ!" }]}
                >
                  <Select
                    mode={id ? "" : "multiple"}
                    placeholder="Chọn kích cỡ"
                    options={sizeOptions}
                    onChange={handleSizeChange}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div style={{ padding: 8 }}>
                          <Input
                            placeholder="Nhập kích cỡ mới"
                            onPressEnter={(e) => {
                              handleAddSize(e.target.value);
                              e.target.value = "";
                            }}
                          />
                        </div>
                      </>
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  {...restField}
                  name={[name, "color"]}
                  validateTrigger={["onChange", "onBlur"]}
                  hasFeedback
                  rules={[{ required: true, message: "Vui lòng chọn màu!" }]}
                >
                  <Input type="color" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  {...restField}
                  name={[name, "colorCode"]}
                  validateTrigger={["onChange", "onBlur"]}
                  hasFeedback
                  rules={[{ required: true, message: "Vui lòng nhập mã màu!" }]}
                >
                  <Input placeholder="Nhập mã màu" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  {...restField}
                  name={[name, "sku"]}
                  validateTrigger={["onChange", "onBlur"]}
                  hasFeedback
                  rules={[{ required: true, message: "Vui lòng nhập SKU!" }]}
                >
                  <Input placeholder="Nhập SKU" />
                </Form.Item>
              </Col>
              <Col span={1}>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
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
          onClick={() => add({ size: "", color: "#000000", colorCode: "", sku: "" })}
          icon={<PlusOutlined />}
        >
          Thêm biến thể
        </Button>
      </Form.Item>
      <Form.ErrorList errors={errors} />
    </>
  )}
</Form.List>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <div className="upload-img">
                  <span>Hình ảnh</span>
                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      dispatch(uploadImages(acceptedFiles));
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section className="border-dashed border-2 p-2 rounded-lg flex flex-col items-center justify-center">
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p className="p-12">
                            Kéo thả một số tệp hình ảnh vào đây, hoặc nhấp để
                            chọn tệp
                          </p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </div>
                <div className="show-img flex gap-3">
                  {existingImages.length > 0 &&
                    existingImages.map((img, index) => (
                      <div key={index} className="mt-2 relative">
                        <button
                          type="button"
                          className="btn-close absolute text-3xl right-0 top-0 text-white"
                          onClick={() => handleRemoveImage(img.public_id)}
                        >
                          <CloseCircleOutlined />
                        </button>
                        <img
                          src={img.url}
                          alt="blog"
                          className="object-cover w-[150px] h-[100px]"
                        />
                      </div>
                    ))}

                  {imgState?.images.length > 0 &&
                    imgState?.images.map((img, index) => (
                      <div key={index} className="mt-2 relative">
                        <button
                          type="button"
                          className="btn-close absolute text-3xl right-0 top-0 text-white"
                          onClick={() => dispatch(deteleImage(img.public_id))}
                        >
                          <CloseCircleOutlined />
                        </button>
                        <img
                          src={img.url}
                          alt="new-blog"
                          className="object-cover w-[150px] h-[100px]"
                        />
                      </div>
                    ))}

                  {imgState?.isLoading == true ? (  <Spin indicator={<LoadingOutlined spin />} size="large" />) :  (existingImages.length === 0 && imgState?.images.length === 0 && (
                    <p className="text-gray-500">
                      Chưa có hình ảnh nào được thêm!  
                    </p>
                  ))}
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" className="mt-3" htmlType="submit">
              {id ? "Lưu" : "Lưu"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ProductForm;
