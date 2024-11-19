import React, { useState, useEffect } from "react";
import { Button, Form, DatePicker, Input, InputNumber, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createSupplier, resetState, getSupplierById, updateSupplier } from "../../redux/supplier/supplierSlice";
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from "react-toastify";
const AddCouponPage = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const getSupplierId = location.pathname.split('/')[3]; 

    const newSupplier = useSelector((state) => state.suppliers);
    const { isSuccess, isError, isLoading, createdSupplier, gotSupplier, updatedSupplier } = newSupplier;

    useEffect(() => {
        if (getSupplierId) {
          dispatch(getSupplierById(getSupplierId));
        }
      }, [dispatch, getSupplierId]);

    useEffect(() => {
    if (getSupplierId && gotSupplier) {
        form.setFieldsValue({
        name: gotSupplier?.name,
        email:gotSupplier?.email ,
        mobile: '0' + gotSupplier?.mobile,
        address: gotSupplier?.address,
        
        });
    }
    }, [gotSupplier, getSupplierId, form]);

    const onFinish = (values) => {
        if (getSupplierId) {
            dispatch(updateSupplier({ id: getSupplierId, data: values }));
          } else {
            dispatch(createSupplier(values));
          }
    };

    useEffect(() => {
        if (isSuccess && createdSupplier) {
            form.resetFields();
            toast.success('Thêm nhà cung cấp thành công');
            dispatch(resetState());
            navigate('/inventory/suppliers');
        }
    }, [isSuccess, isError, isLoading, navigate, createdSupplier, form]);


    useEffect(() => {
        if (isSuccess && updatedSupplier) {
          dispatch(resetState());
          toast.success('Cập nhật nhà cung cấp thành công');
          navigate('/inventory/suppliers');
        }
      }, [isSuccess, updatedSupplier, navigate, dispatch]);
    return (
        <div>
            <div className="bg-white p-5 rounded-lg">
                <h3 className="font-semibold">{getSupplierId ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}</h3>
                <Form
                    form={form}
                    name="addSupplier"
                    onFinish={onFinish}
                    initialValues={{
                        layout: "vertical",
                    }}
                    layout="vertical"
                    scrollToFirstError
                >

                    <Form.Item
                        name="name"
                        label="Tên nhà cung cấp"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên nhà cung cấp!",
                            },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Nhập tên nhà cung cấp" />
                    </Form.Item>

                    <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Vui lòng nhập email!" },
                            {
                                type: "email",
                                message: "Vui lòng nhập đúng định dạng email!",
                              },
                            ]}
                        hasFeedback

                        >
                            <Input
                            placeholder="Nhập email"
                                style={{
                                    width: "100%",
                                }}
                            />
                    </Form.Item>

                    <Form.Item
                        name="mobile"
                        label="Số điện thoại"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                            {
                                pattern: new RegExp(/(03|05|07|08|09)+([0-9]{8})\b/),
                                message: "Số điện thoại không hợp lệ!",
                              },
                        ]}
                        hasFeedback
                    >
                            <Input
                            placeholder="Nhập số điện thoại"
                                style={{
                                    width: "100%",
                                }}
                            />
                    </Form.Item>
                    <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" },
                           
                            ]}
                        hasFeedback

                        >
                            <Input
                                style={{
                                    width: "100%",
                                }}
                                placeholder="Nhập địa chỉ"
                            />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AddCouponPage;
