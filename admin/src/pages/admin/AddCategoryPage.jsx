import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, resetState, getCategoryById, updateCategory } from "../../redux/category/categorySlice";
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from "react-toastify";
const AddCategoryPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const getCategoryId = location.pathname.split('/')[3]; 

  const newCategory = useSelector((state) => state.categories);
  const { isSuccess, isError, isLoading, createdCategory,  gotCategory, updatedCategory } = newCategory;

  useEffect(() => {
    if (getCategoryId) {
      dispatch(getCategoryById(getCategoryId));
    }
  }, [dispatch, getCategoryId]);

  useEffect(() => {
    if (getCategoryId && gotCategory) {
      form.setFieldsValue({
        name: gotCategory?.name,
        description: gotCategory?.description,
      });
    }
  }, [gotCategory, getCategoryId, form]);

  const onFinish = (values) => {
    if (getCategoryId) {
      dispatch(updateCategory({ id: getCategoryId, data: values }));
    } else {
      dispatch(createCategory(values))
    }
  };

  useEffect(() => {
    if (isSuccess && createdCategory) {
      form.resetFields();
      toast.success('Thêm danh mục sản phẩm thành công');
      navigate('/sale/categories');

    }
  }, [isSuccess, isError, isLoading, navigate, createdCategory, form]);

  useEffect(() => {
    if (isSuccess && updatedCategory) {
      dispatch(resetState());
      toast.success('Cập nhật danh mục thành công');
      navigate('/sale/categories');
    }
  }, [isSuccess, updatedCategory, navigate, dispatch]);
  
  return (
    <div>
      <div className="bg-white p-5 rounded-lg ">
      <h3 className="font-semibold">{getCategoryId ? "Sửa danh mục sản phẩm" : "Thêm danh mục sản phẩm"}</h3>

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
            label="Tên danh mục"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên danh mục!",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập tên danh mục" />
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

export default AddCategoryPage;
