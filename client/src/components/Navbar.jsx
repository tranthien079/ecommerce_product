import { assets } from "../assets/assets";
import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "../utils/helper";
import { getUserCart, logoutAuth, resetState } from "../redux/user/userSlice";
import { getAllProduct, getProductById } from "../redux/product/productSlice";
import Notification from "./chat/Notification";
import axios from "axios";
import { base_url } from "../utils/base_url";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [total, setTotal] = useState(null);
  const [paginate, setPaginate] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const range = (start, end) => {
    return Array.from({ length: end - start }, (_, i) => i + start);
  };
  const options = range(0, 100).map((o) => {
    o;
  });
  const authState = useSelector((state) => state?.auth?.user);

  const cartState = useSelector((state) => state?.auth?.cartUser);
  const productState = useSelector((state) => state?.product?.product);
  const [productOpt, setProductOpt] = useState([]);

  const addProductCart = useSelector((state) => state?.auth);
  const { cartProduct } = addProductCart;

  useEffect(() => {
    const fetchProducts = async () => {
      if (query) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${base_url}product/search?name=${query}`
          );
          setProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setProducts([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    dispatch(getUserCart());
    dispatch(getAllProduct());
  }, [dispatch, cartProduct]);

  const handleLogout = () => {
    dispatch(logoutAuth());
    dispatch(resetState());
    navigate("/login");
  };

  useEffect(() => {
    if (cartState?.length > 0) {
      const sum = cartState.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotal(sum);
    } else {
      setTotal(null);
    }
  }, [cartState]);

  useEffect(() => {
    let data = [];
    for (let i = 0; i < productState.length; i++) {
      const element = productState[i];
      data.push({
        id: i,
        productId: element?._id,
        productName: element?.name,
      });
    }
    setProductOpt(data);
  }, [productState]);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
       <img 
      src="https://res.cloudinary.com/dlj4bcepa/image/upload/v1732072178/logo2_gvv9id.svg" 
      alt="Logo" 
      class="w-36 filter invert"
    />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>SẢN PHẨM</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>VỀ CHÚNG TÔI</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>LIÊN HỆ</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
        <NavLink to="/blog" className="flex flex-col items-center gap-1">
          <p>BÀI VIẾT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full relative">
          <input
            className="flex-1 outline-none bg-inherit text-sm"
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* {isLoading && (
            <p className="mt-2 text-sm text-gray-500 absolute left-0 right-0">
              Loading...
            </p>
          )} */}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          {query && !isLoading && (
            <ul className="absolute top-full  mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 w-[400px]  transition-all duration-300 ease-in-out opacity-100">
              {products.length > 0 ? (
                products.map((product) => (
                  <li
                    key={product._id}
                    className="p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  >
                    <Link
                      to={`/product/${product._id}`}
                      onClick={() => setQuery("")}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={product?.images[0]?.url}
                          alt=""
                        />
                        <div className=" dark:text-white">
                          <div className="font-medium">{product.name}</div>
                          {product?.discountPrice > 0 ? (
                            <div className="flex items-center gap-3">
                              <p className="text-gray-400 line-through">
                                {formatPrice(product?.discountPrice)}
                              </p>
                              <p className="text-red-500 font-semibold">
                                {formatPrice(product?.discountPrice)}
                              </p>
                            </div>
                          ) : (
                            <div className="text-gray-900">
                              {formatPrice(product?.price)}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">Không có sản phẩm cần tìm</li>
              )}
            </ul>
          )}
        </div>

        {authState._id ? (
          <>
            <div className="hidden sm:hidden md:flex md:gap-4 lg:flex lg:gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 cursor-pointer"
                onClick={() => handleLogout()}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
              <button
                type="button"
                style={{
                  alignItems: "center",
                  display: "flex",
                  height: "32px",
                }}
                className=""
              >
                <Notification />
              </button>
              <Link to="/wishlist">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </Link>
              <div className="group relative">
                <Link to="/account">
                  <img
                    className="w-5 cursor-pointer"
                    src={assets.profile_icon}
                    alt=""
                  />
                </Link>
              </div>

              <Link to="/cart" className="relative">
                <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
                <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                  {" "}
                  {cartState?.length}
                </p>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="hidden sm:hidden md:flex md:gap-4 lg:flex lg:gap-4 items-center">
              <Link className="text-dark" to="/login">
                Đăng nhập
              </Link>
              <br />
              <Link className="text-dark" to="/register">
                Đăng kí
              </Link>
            </div>
          </>
        )}
      </div>
      <img
        onClick={() => setVisible(true)}
        src={assets.menu_icon}
        className="w-5 cursor-pointer sm:hidden"
        alt=""
      />

      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full z-20" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            Trang chủ
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            Sản phẩm
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            Về chúng tôi
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            Liên hệ
          </NavLink>
          {authState._id ? (
            <>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 pl-6 border"
                to="/cart"
              >
                Giỏ hàng
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 pl-6 border"
                to="/checkout"
              >
                Thanh toán
              </NavLink>
              <NavLink
                onClick={() => handleLogout()}
                className="py-2 pl-6 border"
                to="/login"
              >
                Đăng xuất
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 pl-6 border"
                to="/login"
              >
                Đăng nhập
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 pl-6 border"
                to="/register"
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
