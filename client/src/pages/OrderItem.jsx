import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Badge,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getOrderDetail, resetState } from "../redux/user/userSlice";
import { formatPrice } from "../utils/helper";
import momo from "../../public/images/momo.webp";
import payos from "../../public/images/payos.svg";
import Meta from "../components/Meta";

const OrderItem = () => {
  const dispatch = useDispatch();
  const orderState = useSelector((state) => state?.auth?.gotOrder);
  const location = useLocation();
  const getOrderId = location.pathname.split("/")[3];

  // State to store the total price after discount
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    dispatch(getOrderDetail(getOrderId));
  }, [getOrderId, dispatch]);

  // Calculate total price after fetching order details
  useEffect(() => {
    if (orderState?.orderItems) {
      const total = orderState.orderItems.reduce((sum, item) => {
        const itemPrice =
          item?.productId.discountPrice > 0
            ? item?.productId.discountPrice
            : item?.productId.price;
        return sum + itemPrice * item?.quantity;
      }, 0);

      setDiscountedPrice(total);
      setIsLoading(false);
    }
  }, [orderState]);

  const orderDetails = {
    orderNumber: orderState?._id,
    status: orderState?.orderStatus,
    shopName: "Dev Shop",
    orderItems: orderState?.orderItems,
    shippingFee: orderState?.typeDelivery?.price || 0,
    totalPrice: orderState?.totalPrice,
    paymentMethod: orderState?.paymentInfo,
    paymentStatus: orderState?.paymentStatus
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="blue" className="text-center" />
      </div>
    );
  }

  return (
    orderDetails && (
      <div className="container mx-auto py-6">
            <Meta title={`Mã đơn hàng: ${orderState?._id}`} />

        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <Link
              to="/account/orders"
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
              TRỞ LẠI
            </Link>
            <div className="text-right">
              <Typography variant="h6" className="font-bold text-lg">
                MÃ ĐƠN HÀNG. {orderDetails.orderNumber}
              </Typography>
              <Badge color="green">{orderDetails.status}</Badge>
            </div>
          </div>

          <div>
            {orderDetails?.orderItems?.map((item, index) => (
              <Card className="mb-4 p-4" key={index}>
                <div className="flex">
                  <div className="w-1/4">
                    <img
                      src={item?.productId?.images[0]?.url}
                      alt={item?.productId?.name}
                      className="h-24 object-contain"
                    />
                  </div>
                  <div className="w-1/2 pl-4">
                    <Typography variant="small" className="font-semibold">
                      {item?.productId?.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-500">
                      Phân loại hàng: {item?.color} / {item?.size}
                    </Typography>
                    <Typography variant="small" className="text-gray-500">
                      x{item?.quantity}
                    </Typography>
                  </div>
                  <div className="w-1/4 text-right">
                    {item?.productId.discountPrice > 0 ? (
                      <>
                        <Typography
                          variant="small"
                          className="text-gray-500 line-through"
                        >
                          {formatPrice(item?.productId.price)}
                        </Typography>
                        <Typography variant="small" className="text-red-500">
                          {formatPrice(item?.productId.discountPrice)}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="small" className="text-gray-500">
                        {formatPrice(item?.productId.price)}
                      </Typography>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            <Card className="bg-gray-100 p-4">
              <div className="flex justify-between mb-2">
                <Typography variant="small">Tổng tiền hàng</Typography>
                <Typography variant="small">
                  {formatPrice(discountedPrice)}
                </Typography>
              </div>
              <div className="flex justify-between mb-2">
                <Typography variant="small">Mã giảm giá</Typography>
                <Typography variant="small">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    orderState?.totalPrice <
                      discountedPrice + orderState?.typeDelivery?.price
                      ? -(
                          discountedPrice +
                          orderState?.typeDelivery?.price -
                          orderState?.totalPrice
                        ).toFixed(2)
                      : 0
                  )}
                </Typography>
              </div>
              <div className="flex justify-between mb-2">
                <Typography variant="small">Phí vận chuyển</Typography>
                <Typography variant="small">
                  {formatPrice(orderDetails.shippingFee)}
                </Typography>
              </div>
              <div className="flex justify-between font-bold text-red-500">
                <Typography variant="small">Thành tiền</Typography>
                <Typography variant="small">
                  {formatPrice(orderDetails.totalPrice)}
                </Typography>
              </div>
            </Card>

            <div className="mt-4 flex justify-between">
              <Typography variant="small" className="font-semibold">
                Phương thức Thanh toán
              </Typography>
              <Typography variant="small">
              
                <img className=" w-[60px] rounded-full object-cover object-center" src=  {orderDetails.paymentMethod == 'cash' ? 'https://png.pngtree.com/png-clipart/20210530/original/pngtree-cash-payments-for-cod-with-hand-holding-money-and-box-png-image_6373958.jpg' : orderDetails.paymentMethod == 'momo' ? momo : payos } alt="payment" />
              </Typography>
            </div>
            <div className="mt-4 flex justify-between">
              <Typography variant="small" className="font-semibold">
                Trạng thái thanh toán
              </Typography>
              <Typography variant="small" color={orderDetails?.paymentStatus == 'Chưa thanh toán' ? 'red' : 'green'}>
              {orderDetails?.paymentStatus}
              </Typography>
            </div>
          </div>
        </Card>
      </div>
    )
  );
};

export default OrderItem;
