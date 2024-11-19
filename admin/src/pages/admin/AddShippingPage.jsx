import React, { useState, useEffect } from "react";
import { Button, Form, DatePicker, Input, InputNumber, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createShip, resetState, getShipById, updateShip } from "../../redux/shipping/shippingSlice";
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from "react-toastify";
import moment from "moment";
const AddShippingPage = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const getShipId = location.pathname.split('/')[3]; 

    const newShip = useSelector((state) => state.ships);
    const { isSuccess, isError, isLoading, createdShip, gotShip, updatedShip } = newShip;

    useEffect(() => {
        if (getShipId) {
          dispatch(getShipById(getShipId));
        } 
      }, [dispatch, getShipId]);

    useEffect(() => {
    if (getShipId && gotShip) {
        form.setFieldsValue({
        name: gotShip?.name,
        price: gotShip?.price,
        });
    }
    }, [gotShip, getShipId, form]);

    const onFinish = (values) => {
        if (getShipId) {
            dispatch(updateShip({ id: getShipId, data: values }));
          } else {
            dispatch(createShip(values));
          }
    };

    useEffect(() => {
        if (isSuccess && createdShip) {
            form.resetFields();
            toast.success('Thêm đơn vị vận chuyển thành công');
            dispatch(resetState());
            navigate('/sale/shipping');
        }
    }, [isSuccess, isError, isLoading, navigate, createdShip, form]);


    useEffect(() => {
        if (isSuccess && updatedShip) {
          dispatch(resetState());
          toast.success('Cập nhật đơn vị vận chuyển thành công');
          navigate('/sale/shipping');
        }
      }, [isSuccess, updatedShip, navigate, dispatch]);
    return (
        <div>
            <div className="bg-white p-5 rounded-lg">
                <h3 className="font-semibold">{getShipId ? "Sửa đơn vị vận chuyển" : "Thêm đơn vị vận chuyển"}</h3>
                <Form
                    form={form}
                    name="addShip"
                    onFinish={onFinish}
                    initialValues={{
                        layout: "vertical",
                    }}
                    layout="vertical"
                    scrollToFirstError
                >

                    <Form.Item
                        name="name"
                        label="Tên đơn vị vận chuyển"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên đơn vị vận chuyển!",
                            },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Nhập tên đơn vị vận chuyển"/>
                    </Form.Item>


                    <Form.Item
                        name="price"
                        label="Giá vận chuyển"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá vận chuyển!",
                            },
                        ]}
                        hasFeedback
                    >
                            <InputNumber
                            placeholder="Nhập giá vận chuyển"
                            min={1}
                            step={1}
                            precision={0}
                                style={{
                                    width: "100%",
                                }}
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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

export default AddShippingPage;
