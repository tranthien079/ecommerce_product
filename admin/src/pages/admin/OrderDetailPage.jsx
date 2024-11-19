import React, { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  MessageOutlined,
  ShopOutlined,
  ArrowLeftOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../redux/order/orderSlice";
import momo from "../../../public/images/momo.webp";
import payos from "../../../public/images/payos.svg";
const OrderDetailPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getOrderId = location.pathname.split("/")[3];
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const orderState = useSelector((state) => state?.orders?.gotOrder);
  useEffect(() => {
    if (getOrderId) {
      dispatch(getOrderById(getOrderId));
    }
  }, [dispatch, getOrderId]);

  useEffect(() => {
    if (orderState?.orderItems) {
      const total = orderState.orderItems.reduce((sum, item) => {
        const itemPrice =
          item?.productId.discountPrice > 0
            ? item?.productId.discountPrice
            : item?.productId.price;
        return sum + itemPrice * item?.quantity;
      }, 0);

      setDiscountedPrice(total); // Cập nhật giá trị tổng tiền hàng
    }
  }, [orderState]);
  return (
    <div className="mx-auto p-4 font-sans">
      <div className="TWLNg9">
        <div className="qJkRlY"></div>
      </div>
      <div className="mx-auto p-4 bg-white border-b">
        <div className="flex items-center mb-4">
          <ArrowLeftOutlined className="mr-2 text-blue-500" />
          <Link to="/sale/orders" className="text-blue-500">
            TRỞ LẠI
          </Link>
          <span className="ml-auto">
            MÃ ĐƠN HÀNG:{" "}
            <span className="font-semibold">{orderState?._id}</span> |{" "}
            <span className="text-green-500 font-semibold">
              {orderState?.orderStatus}
            </span>
          </span>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Địa Chỉ Nhận Hàng</h2>
            <span className="text-md text-gray-500">
              {" "}
              <span className="text-xl font-semibold">
                Đơn vị vận chuyển:
              </span>{" "}
              {orderState?.typeDelivery?.name}
            </span>
          </div>
        </div>

        {/* Customer Details */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">
              {orderState?.shippingInfo?.firstname}{" "}
              {orderState?.shippingInfo?.lastname}
            </h3>
            <p className="text-md text-gray-600">
              {orderState?.shippingInfo?.mobile}
            </p>
            <p className="text-md text-gray-600">
              {orderState?.shippingInfo?.address}
            </p>
          </div>
        </div>
        {/* Order Items */}
        {orderState?.orderItems?.map((item, index) => {
          return (
            <div className="p-4 border-t border-b" key={index}>
              <div className="flex items-center space-x-4 ">
                <img
                  src={item?.productId?.images[0]?.url}
                  alt="Product"
                  className="w-20 object-cover"
                />
                <div className="flex-grow">
                  <h3 className="font-medium text-lg">
                    Bộ dụng cụ nắn mụn 4 cây 8 đầu đa năng và tiện dụng chất
                    liệu kim loại không gỉ cao cấp, an toàn cho làn da
                  </h3>
                  <p className="text-md text-gray-600">x1</p>
                </div>
                <div className="text-right">
                  {item?.productId?.discountPrice > 0 ? (
                    <>
                      <p className="line-through text-gray-500">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item?.productId?.price)}
                      </p>
                      <p className="font-semibold text-red-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item?.productId?.discountPrice)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item?.productId?.price)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Order Summary */}
        <div className="p-4 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tổng tiền hàng</span>
              <span>
                {" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(discountedPrice)}{" "}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>
                {" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderState?.typeDelivery?.price || 0)}{" "}
              </span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span className="flex items-center">
                Mã giảm giá
              </span>
              <span>
              {
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(
                orderState?.totalPrice < discountedPrice + orderState?.typeDelivery?.price
                  ? -(discountedPrice + orderState?.typeDelivery?.price - orderState?.totalPrice).toFixed(2)
                  : 0
              )
            }

              </span>
            </div>
            <div className="flex justify-between font-semibold text-xl">
              <span>Thành tiền</span>
              <span className="text-red-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderState?.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-4 border-t flex justify-between items-center">
          <span>Phương thức Thanh toán</span>
          <span className="font-semibold">
            {orderState?.paymentInfo == "cash" ? (
              <>
                <img
                  className="mx-2"
                  width="37"
                  src='https://png.pngtree.com/png-clipart/20210530/original/pngtree-cash-payments-for-cod-with-hand-holding-money-and-box-png-image_6373958.jpg'
                  alt="cod"
                />
                <span>Thanh toán khi nhận hàng</span>
              </>
            ) : orderState?.paymentInfo == "momo" ? (
              <>
                <img
                  className="mx-2"
                  width="35"
                  src={momo}
                  alt="Momo"
                />
                <span>{orderState?.paymentInfo.toUpperCase()}</span>
              </>
            ) : (
              <>
                <img
                  className="mx-2"
                  width="37"
                  src={payos}
                  alt="payos"
                />
                <span>{orderState?.paymentInfo.toUpperCase()}</span>
              </>
            )}
          </span>
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <span>Trạng thái thanh toán</span>
          <span className="font-semibold">
            {orderState?.paymentStatus == "Chưa thanh toán" ? (
              <>
            
                <span className="text-red-800 text-xxl">Chưa thanh toán</span>
              </>
            ) : (
              <>
                <span className="text-green-800 text-xxl">Đã thanh toán</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
