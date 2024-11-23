import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createBCategory, resetState, updateBCategory, getBCategoryById } from "../../redux/bcategory/bcategorySlice";
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from "react-toastify";
const AddBCategoryPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const getBCategoryId = location.pathname.split('/')[3]; 

  const newBCategory = useSelector((state) => state.bcategories);
  const { isSuccess, isError, isLoading, createdBCategory, updatedBCategory, gotBCategory } = newBCategory;

  const onFinish = (values) => {
    if (getBCategoryId) {
      dispatch(updateBCategory({ id: getBCategoryId, data: values }));
    } else {
      dispatch(createBCategory(values));
    }
  };
  useEffect(() => {
    if (getBCategoryId) {
      dispatch(getBCategoryById(getBCategoryId));
    }
  }, [dispatch, getBCategoryId]);

  useEffect(() => {
    if (getBCategoryId && gotBCategory) {
      form.setFieldsValue({
        name: gotBCategory?.name,
        description: gotBCategory?.description
      });
    }
  }, [gotBCategory, getBCategoryId, form]);



  useEffect(() => {
    if (isSuccess && createdBCategory) {
      form.resetFields();
      toast.success('Thêm chủ đề thành công');
      dispatch(resetState());
      navigate('/sale/bcategories');

    }
  }, [isSuccess, isError, isLoading, navigate, createdBCategory, form]);

  useEffect(() => {
    if (isSuccess && updatedBCategory) {
      dispatch(resetState());
      toast.success('Cập nhật chủ đề thành công');
      navigate('/sale/bcategories');
    }
  }, [isSuccess, updatedBCategory, navigate, dispatch]);


  return (
    <div>
      <div className="bg-white p-5 rounded-lg ">
      <h3 className="font-semibold">{getBCategoryId ? "Sửa chủ đề" : "Thêm chủ đề"}</h3>

        <Form
          form={form}
          name="add-bcategory"
          onFinish={onFinish}
          initialValues={{
            layout: "vertical",
            prefix: "86",
          }}
          layout="vertical"
          style={{}}
          scrollToFirstError
        >
         
          <Form.Item
            name="name"
            label="Tên chủ đề"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên chủ dề!",
              },
            ]}
            hasFeedback
          >
            <Input  placeholder="Nhập tên chủ đề" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            // rules={[
            //   {
            //     required: true,
            //     message: "Vui lòng nhập tên chủ dề!",
            //   },
            // ]}
            hasFeedback
          >
            <Input  placeholder="Nhập mô tả" />
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

export default AddBCategoryPage;
