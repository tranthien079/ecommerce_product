import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/auth/authSlice";
import { toast } from "react-toastify"; 
import TYPE_EMPLOYEE from "../utils/userType";
const LoginPage = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const onFinish = async (values) => {
     await dispatch(login(values));
    };
    const authUser= useSelector((state) => state.auth)

    useEffect(() => {
        if (authUser?.isAuthenticated == true) {
            switch (authUser?.user?.role) {
                case TYPE_EMPLOYEE.ADMIN:
                  navigate("/admin/dashboard");
                  break;
                case TYPE_EMPLOYEE.SALE:
                  navigate("/sale/blogs");
                  break;
                case TYPE_EMPLOYEE.INVENTORY:
                  navigate("/inventory/products");
                  break;
                default:
                  navigate("/login");
                  break;
              }
        }
      }, [authUser]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">

            <div
            className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                        Welcome Back
                    </h2>
                    <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
                        <Form.Item
                            className="text-white"
                            label={<span className="text-lg font-bold text-green-400">Email</span>}
                            name="email"
                            rules={[{ required: true, message: "Vui lòng nhập email!" },
                            {
                                type: "email",
                                message: "Vui lòng nhập đúng định dạng email!",
                              },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                size="large"
                                className="text-gray-500 !border !border-green-400 bg-gray-800 hover:!border-green-500  focus:!bg-green-500 focus:!border-green-500"
                            />
                        </Form.Item>
                        <Form.Item
                            label={<span className="text-lg font-bold text-green-400">Password</span>}
                            name="password"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                className="!text-gray-500 !border !border-green-400 bg-gray-800 hover:!border-green-500 focus:!bg-green-500 focus:!border-green-500"
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            className="my-3 !bg-green-400 !hover:bg-green-300 !text-white !border-none"
                            loading={loading}
                        >
                            Login
                        </Button>
                     
                    </Form>
                </div>
            
            </div>
        </div>
    );
};

export default LoginPage;

// import React, { useState } from "react";
// import { Form, Input, Button, Table, Space, Popconfirm } from "antd";
// import { BorderOutlined} from '@ant-design/icons';
// const ProductAdmin = () => {
//   const [form] = Form.useForm();
//   const [skuList, setSkuList] = useState([]);
//   const [variants, setVariants] = useState({ color: [], size: [] });
//   console.log(skuList);
//   // Thêm SKU mới vào danh sách
//   const addSku = (values) => {
//     const { color, size, stock, price } = values;
  
//     // Thêm vào variants nếu chưa có    
//     if (!variants.color.includes(color)) {
//       setVariants((prevVariants) => ({
//         ...prevVariants,
//         color: [...prevVariants.color, color],
//       }));
//     }
//     if (!variants.size.includes(size)) {
//       setVariants((prevVariants) => ({
//         ...prevVariants,
//         size: [...prevVariants.size, size],
//       }));
//     }
  
//     // Tìm chỉ số của màu và size
//     const selectedColorIndex = variants.color.indexOf(color) !== -1 ? variants.color.indexOf(color) : variants.color.length;
//     const selectedSizeIndex = variants.size.indexOf(size) !== -1 ? variants.size.indexOf(size) : variants.size.length;
  
//     // Thêm vào sku_list
//     setSkuList((prevSkuList) => [
//       ...prevSkuList,
//       {
//         tier_indx: [selectedColorIndex, selectedSizeIndex],
//         color,
//         size,
//         stock: Number(stock),
//         price: Number(price),
//       },
//     ]);
  
//     // Reset form sau khi thêm
//     form.resetFields();
//   };

//   // Xóa SKU
//   const deleteSku = (key) => {
//     // Lấy color và size của dòng bị xóa
//     const { color, size } = skuList[key];
  
//     // Tạo danh sách SKU mới (không chứa dòng bị xóa)
//     const newSkuList = skuList.filter((_, index) => index !== key);
  
//     // Kiểm tra nếu `color` và `size` không còn trong danh sách mới
//     const isColorUsed = newSkuList.some((sku) => sku.color === color);
//     const isSizeUsed = newSkuList.some((sku) => sku.size === size);
  
//     // Cập nhật variants nếu cần xóa `color` và `size` khỏi variants
//     setVariants((prevVariants) => ({
//       color: isColorUsed
//         ? prevVariants.color
//         : prevVariants.color.filter((c) => c !== color),
//       size: isSizeUsed
//         ? prevVariants.size
//         : prevVariants.size.filter((s) => s !== size),
//     }));
  
//     // Cập nhật lại danh sách SKU sau khi xóa
//     setSkuList(newSkuList);
      
//   };
//   // Cấu hình các cột cho bảng hiển thị
//   const columns = [
//     {
//       title: "Màu sắc",
//       dataIndex: "color",
//       key: "color",
//       render: (text) => <><BorderOutlined style={{ backgroundColor: text }} /> <span>{text}</span></>
//     },
//     {
//       title: "Size",
//       dataIndex: "size",
//       key: "size",
//     },
//     {
//       title: "Số lượng",
//       dataIndex: "stock",
//       key: "stock",
//     },
//     {
//       title: "Giá tiền",
//       dataIndex: "price",
//       key: "price",
//     },
//     {
//       title: "Hành động",
//       key: "actions",
//       render: (_, record, index) => (
//         <Space size="middle">
//           <Popconfirm
//             title="Bạn có chắc chắn muốn xóa?"
//             onConfirm={() => deleteSku(index)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Button type="link" danger>
//               Xóa
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <h2>Thêm Sản phẩm</h2>
//       <Form form={form} layout="inline" onFinish={addSku}>
//         <Form.Item
//           name="color"
//           style={{ width: "200px" }}
//           rules={[{ required: true, message: "Vui lòng nhập màu sắc!" }]}
//         >
//             <Input type="color" style={{ width: "100%" }} />
//         </Form.Item>

//         <Form.Item
//           name="size"
//           rules={[{ required: true, message: "Vui lòng nhập size!" }]}
//         >
//           <Input placeholder="Size" />
//         </Form.Item>

//         <Form.Item
//           name="stock"
//           rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
//         >
//           <Input placeholder="Số lượng" type="number" />
//         </Form.Item>

//         <Form.Item
//           name="price"
//           rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
//         >
//           <Input placeholder="Giá tiền" type="number" />
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Thêm
//           </Button>
//         </Form.Item>
//       </Form>

//       <Table
//         dataSource={skuList.map((item, index) => ({ ...item, key: index }))}
//         columns={columns}
//       />

//       <div>
//         <h3>Dữ liệu sản phẩm:</h3>
//         <pre>
//           {JSON.stringify(
//             {
//               name: "Sua tam 66666",
//               description: "Sua tam very good in price currenqqwqwt",
//               price: 5233,
//               categoryId: "asdasd",
//               brandId: "asdasdasd",
//               variants: [
//                 { name: "color", options: variants.color },
//                 { name: "size", options: variants.size },
//               ],
//               sku_list: skuList.map((sku) => ({
//                 tier_indx: [
//                   variants.color.indexOf(sku.color),
//                   variants.size.indexOf(sku.size),
//                 ],
//                 price: sku.price,
//                 stock: sku.stock,
//               })),
//             },
//             null,
//             2
//           )}
//         </pre>
//       </div>
//     </div>
//   );
// };

// export default ProductAdmin;
