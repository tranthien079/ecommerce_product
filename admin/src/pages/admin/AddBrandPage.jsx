import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createBrand, resetState, getBrandById, updateBrand } from "../../redux/brand/brandSlice";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const AddBrandPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const getBrandId = location.pathname.split('/')[3]; 
  const newBrand = useSelector((state) => state.brands);
  const { isSuccess, isError, isLoading, createdBrand, gotBrand, updatedBrand } = newBrand;

  useEffect(() => {
    if (getBrandId) {
      dispatch(getBrandById(getBrandId));
    }
  }, [dispatch, getBrandId]);

  useEffect(() => {
    if (getBrandId && gotBrand) {
      form.setFieldsValue({
        name: gotBrand?.name,
        description: gotBrand?.description
      });
    }
  }, [gotBrand, getBrandId, form]);

  const onFinish = (values) => {
    if (getBrandId) {
      dispatch(updateBrand({ id: getBrandId, data: values }));
    } else {
      dispatch(createBrand(values));
    }
  };

  useEffect(() => {
    if (isSuccess && createdBrand) {
      form.resetFields();
      dispatch(resetState());
      toast.success('Thêm thương hiệu thành công');
      navigate('/sale/brands');
    }
  }, [isSuccess, createdBrand, navigate, dispatch, form]);

  useEffect(() => {
    if (isSuccess && updatedBrand) {
      dispatch(resetState());
      toast.success('Cập nhật thương hiệu thành công');
      navigate('/sale/brands');
    }
  }, [isSuccess, updatedBrand, navigate, dispatch]);

  return (
    <div>
      <div className="bg-white p-5 rounded-lg ">
        <h3 className="font-semibold">{getBrandId ? "Sửa thương hiệu" : "Thêm thương hiệu"}</h3>
        <Form
          form={form}
          name="add"
          onFinish={onFinish}
          initialValues={{
            layout: "vertical",
          }}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên thương hiệu!",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập tên thương hiệu" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"

          >
            <Input placeholder="Nhập mô tả" />
          </Form.Item>
          <Form.Item>
            <Button type="" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddBrandPage;
