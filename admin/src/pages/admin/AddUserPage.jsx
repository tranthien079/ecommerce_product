import React, { useEffect } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { register, resetState, findUser, updateUser } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const { Option } = Select;

const AddUserPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user ID from URL params if we're editing a user
  const getUserId = location.pathname.split("/")[3];
  
  const newUser = useSelector((state) => state.auth);
  const { isSuccess, isError, isLoading, createdUser, findedUser, updatedUser } = newUser;

  // Fetch user data if we're editing
  useEffect(() => {
    if (getUserId) {
      dispatch(findUser(getUserId));
    } 
  }, [dispatch, getUserId]);

  // Set form fields when user data is fetched for editing
  useEffect(() => {
    if (getUserId && findedUser) {
      form.setFieldsValue({
        firstname: findedUser?.firstname,
        lastname: findedUser?.lastname,
        email: findedUser?.email,
        mobile: findedUser?.mobile,
        address: findedUser?.address,
        role: findedUser?.role,
      });
    }
  }, [findedUser, getUserId, form]);

  const onFinish = (values) => {
    if (getUserId) {
      const data = { userId: getUserId, data: values }
      dispatch(updateUser(data));
    } else {
      dispatch(register(values));
    }
  };

  // Handle success for creating or updating the user
  useEffect(() => {
    if (isSuccess && (createdUser || updatedUser)) {
      form.resetFields();
      dispatch(resetState());
      toast.success(getUserId ? "Cập nhật người dùng thành công" : "Thêm người dùng thành công");
      navigate("/admin/users");
    }
  }, [isSuccess, createdUser, updatedUser, navigate, dispatch, form, getUserId]);

  return (
    <div>
      <div className="bg-white p-5 rounded-lg">
        <h3 className="font-semibold">{getUserId ? "Sửa người dùng" : "Đăng ký người dùng"}</h3>
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
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstname"
                label="Họ đệm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ!",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập họ đệm" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lastname"
                label="Tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên!",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tên" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
            <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    required: !getUserId, // Only required if creating a new user
                    message: "Vui lòng nhập mật khẩu!",
                  },
                  // {
                  //   min: 6,
                  //   message: "Mật khẩu phải dài ít nhất 6 ký tự!",
                  // },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    message: "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ thường, chữ in hoa, số và ký tự đặc biệt!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password  disabled={!!getUserId}   placeholder="Nhập mật khẩu" />
              </Form.Item> 
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="mobile"
                label="Số điện thoại"
                rules={[
                  {
                    min: 10,
                    message: "Số điện thoại ít nhất 10 số!",
                  },
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ!",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={24}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn vai trò!",
                  },
                ]}
                hasFeedback
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="sale">Nhân viên bán hàng</Option>
                  <Option value="inventory">Nhân viên kho</Option>
                  <Option value="admin">Quản lý</Option>
                  <Option value="user">Khách hàng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {getUserId ? "Lưu" : "Lưu"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default AddUserPage;
