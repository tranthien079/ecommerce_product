import React, { useState, useEffect } from "react";
import { Button, Form, DatePicker, Input, InputNumber, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon, resetState, getCouponById, updateCoupon } from "../../redux/coupon/couponSlice";
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from "react-toastify";
import moment from "moment";
const AddCouponPage = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const getCouponId = location.pathname.split('/')[3]; 

    const newCoupon = useSelector((state) => state.coupons);
    const { isSuccess, isError, isLoading, createdCoupon, gotCoupon, updatedCoupon } = newCoupon;

    useEffect(() => {
        if (getCouponId) {
          dispatch(getCouponById(getCouponId));
        }
      }, [dispatch, getCouponId]);

    useEffect(() => {
    if (getCouponId && gotCoupon) {
        form.setFieldsValue({
        name: gotCoupon?.name,
        expiry:gotCoupon?.expiry ? moment(gotCoupon.expiry) : null,
        discount: gotCoupon?.discount,
        quantity: gotCoupon?.quantity,
        
        });
    }
    }, [gotCoupon, getCouponId, form]);

    const onFinish = (values) => {
        const dataNew = {
            ...values,
            expiry: values.expiry ? values.expiry.format('YYYY-MM-DD') : null,
        };
        if (getCouponId) {
            dispatch(updateCoupon({ id: getCouponId, data: dataNew }));
          } else {
            dispatch(createCoupon(dataNew));
          }
    };

    useEffect(() => {
        if (isSuccess && createdCoupon) {
            form.resetFields();
            toast.success('Thêm mã giảm giá thành công');
            dispatch(resetState());
            navigate('/sale/coupons');
        }
    }, [isSuccess, isError, isLoading, navigate, createdCoupon, form]);


    useEffect(() => {
        if (isSuccess && updatedCoupon) {
          dispatch(resetState());
          toast.success('Cập nhật mã giảm giá thành công');
          navigate('/sale/coupons');
        }
      }, [isSuccess, updatedCoupon, navigate, dispatch]);
    return (
        <div>
            <div className="bg-white p-5 rounded-lg">
                <h3 className="font-semibold">{getCouponId ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}</h3>
                <Form
                    form={form}
                    name="addCoupon"
                    onFinish={onFinish}
                    initialValues={{
                        layout: "vertical",
                    }}
                    layout="vertical"
                    scrollToFirstError
                >

                    <Form.Item
                        name="name"
                        label="Tên mã giảm giá"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên mã giảm giá!",
                            },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Nhập tên mã giảm giá" />
                    </Form.Item>

                    <Form.Item
                        name="expiry"
                        label="Ngày hết hạn"
                        rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn ngày hết hạn!",
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
                                placeholder="Chọn ngày hết hạn"
                                style={{
                                    width: "100%",
                                }}
                                disabledDate={(current) => current && current < moment().endOf('day')}
                                format="YYYY-MM-DD"
                            />
                    </Form.Item>

                    <Form.Item
                        name="discount"
                        label="Phần trăm giảm giá (đơn vị %)"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập phần trăm giảm giá!",
                            },
                        ]}
                        hasFeedback
                    >
                            <InputNumber
                                max={100}
                                min={1}
                                step={1}  
                                precision={0}
                                style={{
                                    width: "100%",
                                }}
                                placeholder="Nhập phần trăm giảm giá"
                            />
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số lượng mã giảm giá!",
                            },
                        ]}
                        hasFeedback
                    >
                            <InputNumber
                                style={{
                                    width: "100%",
                                }}
                                min={1}
                                step={1}  
                                precision={0}
                                placeholder="Nhập số lượng mã giảm giá"
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
