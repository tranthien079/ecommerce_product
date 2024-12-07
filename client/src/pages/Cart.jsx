import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductCart,
  getUserCart,
  updateProductCart,
} from "../redux/user/userSlice";
import Meta from "../components/Meta";
const Cart = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  const cartState = useSelector((state) => state?.auth?.cartUser);
  const userState =  useSelector((state) => state?.auth?.user);
  const totalAmount =
    cartState?.reduce((total, item) => total + item.price * item.quantity, 0) ||
    0;

  const updateProductQuantity = async (cartId, newQuantity) => {
    await dispatch(updateProductCart({ cartId, newQuantity }));
  };

  const handleQuantityChange = async (cartId, valueQuantity) => {
    const newQuantity = Number(valueQuantity);
    if (newQuantity) {
      await updateProductQuantity(cartId, newQuantity);
      await dispatch(getUserCart());
    }
  };

  const deleteProduct = async (cartId) => {
    await dispatch(deleteProductCart(cartId));
    await dispatch(getUserCart());
  };

  return (
    <div className="border-t pt-14">
      <Meta title="Giỏ hàng"/>
      <div className=" text-2xl mb-3">
        <Title text1={"Giỏ hàng của"} text2={userState?.lastname} />
      </div>

      <div>
        {cartState === null || cartState?.length === 0 ? (
          <div className="text-center text-3xl">Giỏ hàng trống</div>
        ) : null}
        {cartState &&
          cartState?.map((item, index) => (
            <div
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[3fr_1fr_0.5fr_1fr_0.5fr] sm:grid-cols-[3fr_1fr_2fr_1fr_0.5fr] items-center gap-4"
              key={index}
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={item?.productId?.images[0]?.url}
                  alt=""
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{item?.productId?.name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {" "}
                      {item?.color}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item?.size}
                    </p>
                  </div>
                  <p className="mt-2">SKU: {item?.sku}</p>

                </div>
              </div>
              <p className="text-center">{formatPrice(item?.price)}</p>
              <input
                className="border max-w-20 sm:max-x-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                value={item?.quantity}
                onChange={(e) =>
                  handleQuantityChange(item?._id, e.target.value)
                }
              />
              <p className="text-center">
                {formatPrice(item?.price * item?.quantity)}
              </p>
              <img
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
                onClick={() => deleteProduct(item?._id)}
                style={{ cursor: "pointer" }}
              />
            </div>
          ))}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
         <h1 className="text-right text-2xl mb-4">Tổng tiền: {formatPrice(totalAmount)}</h1>
          <div className=" text-end">
            <Link
              to='/checkout'
              className="bg-green-700 hover:bg-green-400 text-white text-2xl my-8 px-8 py-3 w-[200px]"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
