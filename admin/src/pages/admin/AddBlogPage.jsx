import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, Row, Col, Spin } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CloseCircleOutlined,LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { uploadImages, deteleImage } from '../../redux/upload/uploadSlice';
import { toast } from "react-toastify";
import Dropzone from 'react-dropzone';
import { createBlog, resetState, getBlogById, updateBlog } from "../../redux/blog/blogSlice";
import { getBCategory } from "../../redux/bcategory/bcategorySlice";
import { useNavigate, useLocation } from 'react-router-dom';

const AddBlogPage = () => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split('/')[3]; 
  const [existingImages, setExistingImages] = useState([]);
  useEffect(() => {
    dispatch(getBCategory());
  }, [dispatch]);

  const bcategoryState = useSelector((state) => state.bcategories.bcategories);
  const imgState = useSelector((state) => state.images);
  const newBlog = useSelector((state) => state.blogs);
  const { isSuccess, isError, isLoading, createdBlog, gotBlog, updatedBlog } = newBlog;

  const onFinish = (values) => {
    const images = [...existingImages, ...imgState?.images];
    const data = { ...values, images };
    
    if (getBlogId) {
      dispatch(updateBlog({ id: getBlogId, data }));
    } else {
      dispatch(createBlog(data));
    }
  };

  useEffect(() => {
    if (getBlogId) {
      dispatch(getBlogById(getBlogId));
    } 
    // else {
    //   dispatch(resetState());
    // }
  }, [dispatch, getBlogId]);

  useEffect(() => {
    if (getBlogId && gotBlog) {
      form.setFieldsValue({
        title: gotBlog?.title,
        categoryId: gotBlog?.categoryId,
        description: gotBlog?.description,
        content: gotBlog?.content,
      });
      setExistingImages(gotBlog?.images || []);
    }
  }, [gotBlog, getBlogId, form]);

  useEffect(() => {
    if (isSuccess && createdBlog) {
      form.resetFields();
      setExistingImages([]);
      toast.success('Thêm bài viết thành công');
      dispatch(resetState());
      navigate('/sale/blogs');
    }
  }, [isSuccess, isError, isLoading, navigate, createdBlog, form]);

  useEffect(() => {
    if (isSuccess && updatedBlog) {
      dispatch(resetState());
      toast.success('Cập nhật bài viết thành công');
      navigate('/sale/blogs');
    }
  }, [isSuccess, updatedBlog, navigate, dispatch]);

  const handleRemoveImage = (public_id) => {
    dispatch(deteleImage(public_id));
    setExistingImages(existingImages.filter(img => img.public_id !== public_id));
  };

  return (
    <div>
      <div className="bg-white p-5 rounded-lg">
        <h3 className="font-semibold">Thêm bài viết</h3>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            layout: "vertical",
          }}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tiêu đề bài viết!",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Danh mục bài viết"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn danh mục bài viết!",
              },
            ]}
            hasFeedback
          >
            <Select
              showSearch
              placeholder="Chọn danh mục bài viết"
              optionFilterProp="label"
              options={
                bcategoryState && bcategoryState.map((b) => ({
                  value: b._id,
                  label: b.name,
                }))
              }
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả ngắn"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả ngắn!",
              },
            ]}
            hasFeedback
          >
            <TextArea rows={4} placeholder="Nhập mô tả ngắn"  />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả!",
              },
            ]}
          >
            <ReactQuill theme="snow" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <p className="mb-2">Chọn hình ảnh</p>

              <div className="bg-white text-center border-2">
                <Dropzone onDrop={acceptedFiles => {
                  dispatch(uploadImages(acceptedFiles));
                }}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p className="p-12">Kéo & thả hình ảnh vào đây, hoặc nhấn để chọn hình ảnh</p>
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
                      <img src={img.url} alt="blog" className="object-cover w-[150px] h-[100px]" />
                    </div>
                  ))
                }

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
                      <img src={img.url} alt="new-blog" className="object-cover w-[150px] h-[100px]" />
                    </div>
                  ))
                }

                {imgState?.isLoading ? ( <Spin indicator={<LoadingOutlined spin />} size="large" />) :  (existingImages.length === 0 && imgState?.images.length === 0 && (
                  <p className="text-gray-500">Chưa có hình ảnh nào được thêm!</p>
                ))}
              </div>
            </Col>
          </Row>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" className="mt-2">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddBlogPage;
