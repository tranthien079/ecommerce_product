import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,LikeOutlined,
  ShoppingCartOutlined,DashboardOutlined,UserOutlined,BorderOuterOutlined, ReadOutlined ,ShopOutlined ,ScheduleOutlined,FormOutlined,PicLeftOutlined, TruckOutlined ,TagsOutlined, LogoutOutlined, MessageOutlined
} from "@ant-design/icons";
import { Button, Flex, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { logoutAuth } from "../../redux/auth/authSlice";
import Notification from '../chat/Notification'
const { Header, Sider, Content } = Layout;
const LayoutAdmin = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth)
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = ()  => {
    dispatch(logoutAuth()); 
    localStorage.removeItem("user");
    navigate("/login"); 
  }

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
          defaultSelectedKeys={["dashboard"]}
          onClick={({ key }) => {
            if (key == "signout") {
              navigate('/login')
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined style={{ fontSize: '22px' }}/>,
              label:  <span className="text-lg font-medium">Dashboard</span>,
            },
            {
              icon: <UserOutlined  style={{ fontSize: '22px' }} />,
              label:  <span className="text-lg font-medium">Quản lý người dùng</span>,
              children: [
                {
                  key: "user",
                  label:  <span className="text-lg font-medium">Thêm người dùng</span>,
                },
                {
                  key: "users",
                  label:  <span className="text-lg font-medium">Danh sách người dùng</span>,
                },
              ],
            },
            {
              key: "reviews",
              icon: <LikeOutlined style={{ fontSize: '22px' }} />,
              label:  <span className="text-lg font-medium">Quản lý đánh giá</span>,
            },
{
              key: "chat",
              icon: <MessageOutlined style={{ fontSize: '22px' }} />,
              label:  <span className="text-lg font-medium">Chat</span>,
            },
            {
              icon: <LogoutOutlined    style={{ fontSize: '22px' }} />,
              key: "signout",
              label:  <Link to='/login' className="text-lg font-medium" onClick={handleLogout}>Đăng xuất</Link>,

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
              <button type="button"  style={{  alignItems:'center',display: 'flex',height: '32px' }} className="relative rounded-full border-2 p-1 text-gray-400 hover:text-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5"></span>

                <Notification />
              </button>
            <div className="relative ml-3">
              {/* <div>
                <button onClick={toggleDropdown} type="button" className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full" src={user.avatar} alt=""/>
                </button>
              </div>

              {isOpen && (<div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" >
                <Link to="/home" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-0">{user.firstname + " " + user.lastname }</Link>
                <Link to="" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-1">Settings</Link>
                <Link to="/login" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-2"    onClick={handleLogout}>Sign out</Link>
              </div>)} */}
            </div>
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
export default LayoutAdmin;
