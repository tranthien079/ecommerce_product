import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LikeOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  UserOutlined,
  BorderOuterOutlined,
  ReadOutlined,
  ShopOutlined,
  ScheduleOutlined,
  FormOutlined,
  PicLeftOutlined,
  TruckOutlined,
  TagsOutlined,
  LogoutOutlined,
  MessageOutlined
} from "@ant-design/icons";
import { Button, Flex, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAuth } from "../../redux/auth/authSlice";
import Notification from '../chat/Notification'

const { Header, Sider, Content } = Layout;
const LayoutSale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logoutAuth());
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsed={collapsed}
        style={{ background: colorBgContainer }}
      >
        <img
          src="../logoAdmin.svg"
          alt="logo"
          className="img-fluid p-4"
          width="200"
        />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["blogs"]}
          onClick={({ key }) => {
            if (key == "signout") {
              navigate("/login");
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              icon: <ReadOutlined style={{ fontSize: "22px" }} />,
              label: (
                <span className="text-lg font-medium">Quản lý bài viết</span>
              ),
              children: [
                {
                  key: "blog",
                  label: (
                    <span className="text-lg font-medium">Thêm bài viết</span>
                  ),
                },
                {
                  key: "blogs",
                  label: (
                    <span className="text-lg font-medium">
                      Danh sách bài viết
                    </span>
                  ),
                },
              ],
            },

            {
              icon: <BorderOuterOutlined style={{ fontSize: "22px" }} />,
              label: (
                <span className="text-lg font-medium">Quản lý chủ đề</span>
              ),
              children: [
                {
                  key: "bcategory",
                  label: (
                    <span className="text-lg font-medium">Thêm chủ đề</span>
                  ),
                },
                {
                  key: "bcategories",
                  label: (
                    <span className="text-lg font-medium">
                      Danh sách chủ đề
                    </span>
                  ),
                },
              ],
            },
            {
              icon: <BorderOuterOutlined style={{ fontSize: "22px" }} />,
              label: (
                <span className="text-lg font-medium">Quản lý danh mục</span>
              ),
              children: [
                {
                  key: "category",
                  label: (
                    <span className="text-lg font-medium">Thêm danh mục</span>
                  ),
                },
                {
                  key: "categories",
                  label: (
                    <span className="text-lg font-medium">
                      Danh sách danh mục
                    </span>
                  ),
                },
              ],
            },

            {
              icon: <PicLeftOutlined style={{ fontSize: "22px" }} />,
              label: (
                <span className="text-lg font-medium">Quản lý thương hiệu</span>
              ),
              children: [
                {
                  key: "brand",
                  label: (
                    <span className="text-lg font-medium">
                      Thêm thương hiệu
                    </span>
                  ),
                },
                {
                  key: "brands",
                  label: (
                    <span className="text-lg font-medium">
                      Danh sách thương hiệu
                    </span>
                  ),
                },
              ],
            },
            {
              icon: <TagsOutlined style={{ fontSize: "22px" }} />,
              label: (
                <span className="text-lg font-medium">Quản lý mã giảm giá</span>
              ),
              children: [
                {
                  key: "coupon",
                  label: (
                    <span className="text-lg font-medium">
                      Thêm mã giảm giá
                    </span>
                  ),
                },
                {
                  key: "coupons",
                  label: (
                    <span className="text-lg font-medium">
                      Danh sách mã giảm giá
                    </span>
                  ),
                },
              ],
            },
            {
              key: "orders",
              icon: <FormOutlined style={{ fontSize: "22px" }} />,
              label: (
                <span className="text-lg font-medium">Quản lý đơn hàng</span>
              ),
            },

            {
              icon: <TruckOutlined style={{ fontSize: "22px" }} />,
              label: (
                <span className="text-lg font-medium">
                  Quản lý đơn vị vận chuyển
                </span>
              ),
              children: [
                {
                  key: "ship",
                  label: (
                    <span className="text-lg font-medium">
                      Thêm đơn vị vận chuyển
                    </span>
                  ),
                },
                {
                  key: "shipping",
                  label: (
                    <span className="text-lg font-medium">
                      Danh sách đơn vị vận chuyển
                    </span>
                  ),
                },
              ],
            },
{
              key: "chat",
              icon: <MessageOutlined style={{ fontSize: '22px' }} />,
              label:  <span className="text-lg font-medium">Chat</span>,
            },
            {
              icon: <LogoutOutlined style={{ fontSize: "22px" }} />,
              key: "signout",
              label: (
                <Link
                  to="/login"
                  className="text-lg font-medium"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Link>
              ),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Flex justify="space-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            <Flex style={{ marginRight: 20 }} align="center" gap={20}>
              <button
                type="button"
                style={{
                  alignItems: "center",
                  display: "flex",
                  height: "32px",
                }}
                className="relative rounded-full border-2 p-1 text-gray-400 hover:text-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
           
                <Notification />
              </button>
              {/* <div className="relative ml-3">
                <div>
                  <button
                    onClick={toggleDropdown}
                    type="button"
                    className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt=""
                    />
                  </button>
                </div>

                {isOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <Link
                      to="/home"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-0"
                    >
                      {user.firstname + " " + user.lastname}
                    </Link>
                    <Link
                      to=""
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-1"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                      onClick={handleLogout}
                    >
                      Sign out
                    </Link>
                  </div>
                )}
              </div> */}
            </Flex>
          </Flex>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "90vh",
            // background: colorBgContainer,
            // borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutSale;
