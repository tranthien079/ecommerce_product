import React,{ useEffect, useState }  from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { Link, Navigate } from "react-router-dom";
import momo from "../../public/images/momo.webp";
import payos from "../../public/images/payos.svg";

import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "../utils/helper";
import { getAllShipping } from "../redux/shipping/shippingSlice";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { applyCoupon, createOrder, getUserCart } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Meta from '../components/Meta';

const checkoutSchema = yup.object({
  firstname: yup.string().required("Vui lòng nhập họ đệm"),
  lastname: yup.string().required("Vui lòng nhập tên"),
  mobile: yup
    .string()
    .min(10, "Số điện thoại có ít nhất 10 số")
    .required("Vui lòng nhập số điện thoại"),
  address: yup.string().required("Vui lòng nhập địa chỉ"),
});

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectShip, setSelectedShip] = useState(0);
  const [selectPayment, setSelectedPayment] = useState("");
  const [coupon, setCoupon] = useState(0);

  const [data, setData] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState({ id: "", name: "" });
  const [selectedDistrict, setSelectedDistrict] = useState({
    id: "",
    name: "",
  });
  const [selectedWard, setSelectedWard] = useState({ id: "", name: "" });

  const cartState = useSelector((state) => state?.auth?.cartUser);
  const totalAmount =
    cartState?.reduce((total, item) => total + item.price * item.quantity, 0) ||
    0;
  const shippingState = useSelector((state) => state?.shipping?.shipping);

  const orderState = useSelector((state) => state?.auth);

  const applyCouponState = useSelector((state) => state?.auth?.appliedCoupon);

  const getShipping = () => {
    dispatch(getAllShipping());
  };
  useEffect(() => {
    getShipping();
  }, [dispatch]);

  useEffect(() => {
    if (applyCouponState?.discount) {
      setCoupon(applyCouponState.discount);
    }
  }, [applyCouponState]);

  const formik1 = useFormik({
    initialValues: {
      coupon: "",
    },
    onSubmit: async (values) => {
      const result = await dispatch(applyCoupon(values));
      if (result.payload?.discount) {
        toast.success("Mã giảm giá đã áp dụng");
        setCoupon(result.payload.discount);
      } 
    },
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      mobile: "",
      address: "",
    },
    validationSchema: checkoutSchema,
    onSubmit: async (values) => {
      if (!selectShip) {
        toast.error("Vui lòng chọn đơn vị vận chuyển");
        return;
      }
      if (!selectPayment) {
        toast.error("Vui lòng chọn phương thức thanh toán");
        return;
      }
      if (!selectedCity) {
        toast.error("Vui lòng chọn tỉnh/thành phố");
        return;
      }
      if (!selectedDistrict) {
        toast.error("Vui lòng chọn quận/huyện");
        return;
      }
      if (!selectedWard) {
        toast.error("Vui lòng chọn phường xã");
        return;
      }


      if (
        selectShip &&
        selectPayment &&
        cartState.length > 0 &&
        selectedCity &&
        selectedDistrict &&
        selectedWard
      ) {
        const updatedValues = {
          ...values,
          address: `${values.address}, ${selectedWard?.name}, ${selectedDistrict?.name}, ${selectedCity?.name}`,
        };
        const data = {
          shippingInfo: updatedValues,
          paymentInfo: selectPayment,
          orderItems: cartState,
          totalPrice: coupon > 0 
          ? (Number(totalAmount) + Number(selectShip?.price_ship || 0)) - (Number(totalAmount) * Number(coupon) / 100)
          : Number(totalAmount) + Number(selectShip?.price_ship || 0),
          // totalPriceAfterDiscount: totalAmount,
          typeDelivery: selectShip?.ship_id,
        };
        if (selectPayment === "momo") {
          const response = await dispatch(createOrder(data));
          if (response?.payload?.paymentResult?.payUrl) {
            window.location.href = response.payload.paymentResult.payUrl;
          }
          await dispatch(getUserCart());
        } else if (selectPayment === "payos") {
          const response = await dispatch(createOrder(data));
          if (response?.payload?.paymentResult?.checkoutUrl) {
            window.location.href = response.payload.paymentResult.checkoutUrl;
          }
          await dispatch(getUserCart());
        } else {
          await dispatch(createOrder(data));
          await dispatch(getUserCart());
          toast.success("Đặt hàng thành công");
          navigate("/payment-success");
        }
      } else {
        toast.error("Vui lòng thêm sản phẩm vào giỏ hàng");
      }
    },
  });

  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      )
      .then((response) => {
        setData(response.data);
        setCities(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    const cityName = event.target.options[event.target.selectedIndex].text;
    setSelectedCity({ id: cityId, name: cityName });
    setDistricts([]);
    setWards([]);
    setSelectedDistrict({ id: "", name: "" });
    setSelectedWard({ id: "", name: "" });

    if (cityId) {
      const selectedCityData = data.find((city) => city.Id === cityId);
      setDistricts(selectedCityData ? selectedCityData.Districts : []);
    }
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    const districtName = event.target.options[event.target.selectedIndex].text;
    setSelectedDistrict({ id: districtId, name: districtName });
    setWards([]);
    setSelectedWard({ id: "", name: "" });

    if (districtId) {
      const selectedCityData = data.find((city) => city.Id === selectedCity.id);
      const selectedDistrictData = selectedCityData.Districts.find(
        (district) => district.Id === districtId
      );
      setWards(selectedDistrictData ? selectedDistrictData.Wards : []);
    }
  };

  const handleWardChange = (event) => {
    const wardId = event.target.value;
    const wardName = event.target.options[event.target.selectedIndex].text;
    setSelectedWard({ id: wardId, name: wardName });
  };
  return (
    <>
     <div className="checkout-wrapper">
     <Meta title="Thanh toán" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="w-full">
          <form onSubmit={formik.handleSubmit} className="md:flex gap-8">
            {/* Left Column */}
            <div className="md:w-7/12 w-full">
              <div className="mr-2">
                <h3 className="website-name"></h3>
                <h4 className="text-lg font-semibold mb-2">Thông tin liên hệ</h4>
               

                <div className="flex flex-row gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ đệm
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                      name="firstname"
                      value={formik.values.firstname}
                      onChange={formik.handleChange("firstname")}
                      onBlur={formik.handleBlur("firstname")}
                      placeholder='Vui lòng nhập họ đệm'
                    />
                    {formik.touched.firstname && formik.errors.firstname && (
                      <div className="text-red-500 text-sm italic">
                        {formik.errors.firstname}
                      </div>
                    )}
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                      name="lastname"
                      value={formik.values.lastname}
                      onChange={formik.handleChange("lastname")}
                      onBlur={formik.handleBlur("lastname")}
                      placeholder='Vui lòng nhập tên'
                    />
                    {formik.touched.lastname && formik.errors.lastname && (
                      <div className="text-red-500 text-sm italic">
                        {formik.errors.lastname}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange("mobile")}
                    onBlur={formik.handleBlur("mobile")}
                    placeholder='Vui lòng nhập số điện thoại'
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="text-red-500 text-sm italic">
                      {formik.errors.mobile}
                    </div>
                  )}
                </div>
                <div className="flex flex-row gap-4  mt-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số nhà / Tên đường
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange("address")}
                    onBlur={formik.handleBlur("address")}
                    placeholder='Vui lòng nhập số nhà / tên đường'
                  />
                  {formik.touched.address && formik.errors.address && (
                    <div className="text-red-500 text-sm italic">
                      {formik.errors.address}
                    </div>
                  )}
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh thành phố
                  </label>
                  <select
                    onChange={handleCityChange}
                    value={selectedCity.id}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {cities.map((city) => (
                      <option key={city.Id} value={city.Id}>
                        {city.Name}
                      </option>
                    ))}
                  </select>
                </div>
                </div>
                <div className="flex flex-row gap-4  mt-4">

                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận huyện
                  </label>
                  <select
                    onChange={handleDistrictChange}
                    value={selectedDistrict.id}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.Id} value={district.Id}>
                        {district.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường xã
                  </label>
                  <select
                    onChange={handleWardChange}
                    value={selectedWard.id}
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  >
                    <option value="">Chọn phường/xã</option>
                    {wards.map((ward) => (
                      <option key={ward.Id} value={ward.Id}>
                        {ward.Name}
                      </option>
                    ))}
                  </select>
                </div>
                    </div>
                <div className="mt-6">
                  <div className="flex justify-between items-baseline">
                    <Link to="/cart" className="text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>
 Trở lại giỏ hàng
                    </Link>
                    <Link
                      to="/collection"
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700"
                    >
                      Tiếp tục mua hàng
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:w-5/12 w-full">
              <div className="border-b border-gray-200 py-4">
                {cartState?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 mb-4 items-center"
                  >
                    <div className="w-3/4 flex gap-4">
                      <div className="w-1/4 relative">
                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-2 text-xs ">
                          {item?.quantity}
                        </span>
                        <img
                          className="w-full h-auto"
                          src={item?.productId?.images[0]?.url}
                          alt="product"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium">{item?.name}</h5>
                        <p className="text-sm text-gray-600">
                          {item?.color} / {item?.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-medium">{formatPrice(item?.price)}</h5>
                    </div>
                  </div>
                ))}
              </div>

              <div className="py-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl font-semibold">Thành tiền</p>
                  <p>{formatPrice(totalAmount)}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2">Áp mã giảm giá</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="coupon"
                      className="flex-1  shadow-sm focus:border-indigo-500 px-2 focus:ring-indigo-500 border border-gray-300 rounded"
                      value={formik1.values.coupon}
                      onChange={formik1.handleChange("coupon")}
                      onBlur={formik1.handleBlur("coupon")}
                    />
                    <button
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700"
                      type="button"
                      onClick={formik1.handleSubmit}
                    >
                      Sử dụng
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Phương thức vận chuyển</h4>
                  {shippingState && shippingState?.map((ship, index) => (
                      <div className='flex gap-3 flex-col lg:flex-row mt-2' key={index} >
                      <div onClick={(e) =>
                                    setSelectedShip({
                                      ship_id: ship._id,
                                      price_ship: ship.price,
                                    })
                                  } className='flex items-center gap-3 border p-2 px-3 cursor-pointer'   value={ship._id}
                                  id={ship._id}>
                        <p className={`min-w-3.5 h-3.5 border rounded-full ${selectShip?.ship_id === ship?._id ? 'bg-green-400' : ''}`}></p>
                        <p> {ship?.name} - {formatPrice(ship?.price)}</p>
                      </div>
                   
                    </div>
                    
                    
                  ))}
                 
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Phương thức thanh toán</h4>
                  
                  <div className="space-y-2">
                    {/* Momo Payment */}
                    <div className={`border rounded ${selectPayment === 'momo' ? 'bg-gray-300' : ''}`}>
                      <label className="flex items-center p-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentInfo"
                          value="momo"
                          className="hidden"
                          onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <img className="w-8 h-8 mr-2" src={momo} alt="Momo" />
                        <span>Thanh toán qua Momo</span>
                      </label>
                    </div>

                    {/* PayOS Payment */}
                    <div className={`border rounded ${selectPayment === 'payos' ? 'bg-gray-300' : ''}`}>
                      <label className="flex items-center p-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentInfo"
                          value="payos"
                          className="hidden"
                          onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <img className="w-8 h-8 mr-2" src={payos} alt="PayOS" />
                        <span>Thanh toán qua PayOS</span>
                      </label>
                    </div>

                    {/* Cash Payment */}
                    <div className={`border rounded ${selectPayment === 'cash' ? 'bg-gray-300' : ''}`}>
                      <label className="flex items-center p-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentInfo"
                          value="cash"
                          className={`hidden `}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <img
                          className="w-8 h-8 mr-2"
                          src="https://png.pngtree.com/png-clipart/20210530/original/pngtree-cash-payments-for-cod-with-hand-holding-money-and-box-png-image_6373958.jpg"
                          alt="COD"
                        />
                        <span>Thanh toán khi nhận hàng</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4">
                  <h4 className="font-semibold text-2xl">Tổng tiền:</h4>
                  <h5 className="font-semibold">
                    {coupon > 0
                      ? formatPrice(
                          Number(totalAmount) +
                            Number(selectShip?.price_ship || 0) -
                            (Number(totalAmount) * Number(coupon)) / 100
                        )
                      : formatPrice(
                          totalAmount + Number(selectShip?.price_ship || 0)
                        )}
                  </h5>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-green-700 hover:bg-green-400 text-white text-2xl rounded-md hover:bg-gray-800 transition-colors"
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    </>
 
  )
}

export default PlaceOrder
