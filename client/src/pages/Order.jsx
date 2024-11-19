/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrder, updateOrderStatus } from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { formatDate, formatPrice } from "../utils/helper";
import {
  Tabs,
  Tab,
  TabsHeader,
  TabsBody,
  TabPanel,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react"; // Import Material Tailwind Tabs
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const Order = () => {
  const [activeTab, setActiveTab] = useState("tatca");
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state.auth.orderUser);

  useEffect(() => {
    dispatch(getUserOrder());
  }, [dispatch]);

  const filterOrders = (status) => {
    return orderState?.filter((order) => order.orderStatus === status);
  };

  return (
    <div className="container mt-4">
          <Meta title="Đơn hàng" />

      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabsHeader
          className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
          indicatorProps={{
            className:
              "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
          }}
        >
          <Tab value="tatca">Tất cả</Tab>
          <Tab value="chothanhtoan">Chờ xác nhận</Tab>
          <Tab value="vanchuyen">Đã xác nhận</Tab>
          <Tab value="chogiaohang">Đang giao</Tab>
          <Tab value="hoanthanh">Hoàn thành</Tab>
          <Tab value="huy">Đã hủy</Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value="tatca">
            <OrderList orders={orderState} />
          </TabPanel>
          <TabPanel value="chothanhtoan">
            <OrderList orders={filterOrders("Chờ xác nhận")} />
          </TabPanel>
          <TabPanel value="vanchuyen">
            <OrderList orders={filterOrders("Đã xác nhận")} />
          </TabPanel>
          <TabPanel value="chogiaohang">
            <OrderList orders={filterOrders("Đang giao")} />
          </TabPanel>
          <TabPanel value="hoanthanh">
            <OrderList orders={filterOrders("Hoàn thành")} />
          </TabPanel>
          <TabPanel value="huy">
            <OrderList orders={filterOrders("Đã hủy")} />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

// Component hiển thị danh sách đơn hàng
const OrderList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="VJ0a8O p-5">
        <div className="E_bH9K"></div>
        <h2 className="JDtdsv">Chưa có đơn hàng</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="order-details mb-4">
        {orders.map((order, index) => (
          <OrderDetails key={index} order={order} />
        ))}
      </div>
    </div>
  );
};

const OrderDetails = ({ order }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const dispatch = useDispatch();
  const isWithinOneHour = () => {
    const orderTime = new Date(order?.createdAt).getTime(); 
    const currentTime = new Date().getTime(); 
    const oneHourInMs = 60 * 60 * 1000; 
    const timeDifference = currentTime - orderTime;
  
    // kiểm tra order trong vòng 1 tiếng cho hủy còn sau 1 tiếng k cho hủy
    const isWithin = timeDifference <= oneHourInMs;

    return isWithin;
  };
  console.log(isWithinOneHour())

  const handleCancelOrder = async (id) => {
    const data = { id: id, status: "Đã hủy" };
    await dispatch(updateOrderStatus(data));
    await dispatch(getUserOrder());
    setOpen(!open);
    toast.success('Hủy đơn hàng thành công!')
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "text-gray-500";
      case "Đã xác nhận":
        return "text-yellow-500";
      case "Đang giao":
        return "text-blue-500";
      case "Hoàn thành":
        return "text-green-500";
      case "Đã hủy":
        return "text-red-500";
      default:
        return "text-black";
    }
  };

  return (
    <div className="order-details mb-4">
      <Link to={`/account/order/${order._id}`} className="w-full">
        <div className="flex justify-between items-center">
          <div>
            <i className="fas fa-truck"></i> Mã đơn hàng: {order._id} <br />
            <span className="text-secondary">
              Ngày đặt: {formatDate(order.paidAt)}
            </span>
          </div>
          <div className={getStatusColor(order.orderStatus)}>
            {order.orderStatus}
          </div>
        </div>

        <table className="table-auto w-full mt-3">
          <tbody>
            {order.orderItems.map((item, idx) => (
              <tr key={idx}>
                <td className="flex">
                  <img
                    src={item?.productId?.images[0]?.url}
                    alt={item?.productId?.name}
                    width="100"
                    height="100"
                    className="mr-3"
                  />
                  <div className="flex flex-col">
                    <strong>{item?.productId?.name}</strong>
                    <div className="text-sm text-muted">
                      {item?.color} / {item?.size}
                    </div>
                    <div className="text-sm">x{item?.quantity}</div>
                  </div>
                </td>
                <td className="text-right">
                  <div className="text-red-500">{formatPrice(item?.price)}</div>
                  <div className="text-sm text-muted">
                    <del>{formatPrice(item?.productId?.price)}</del>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Link>

      <div className="flex justify-end items-center">
        {order.orderStatus === "Chờ xác nhận" && isWithinOneHour() && (
          <div className="text-end mr-3">
            <Button onClick={handleOpen} variant="gradient" color="red">
              Hủy đơn hàng
            </Button>
          </div>
        )}
        <p className="mb-0">Tổng tiền: </p>
        <span className="text-red-500">
          {" "}
          {formatPrice(order.totalPriceAfterDiscount || order.totalPrice)}
        </span>
      </div>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Hủy đơn hàng</DialogHeader>
        <DialogBody>Bạn có chắc chắn muốn hủy đơn hàng này không?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Hủy bỏ</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => handleCancelOrder(order._id)}
          >
            <span>Xác nhận</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Order;
