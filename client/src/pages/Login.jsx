import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart, login } from "../redux/user/userSlice";
import * as yup from "yup";
import { useFormik } from "formik";
import { Typography } from "@material-tailwind/react";
import Meta from "../components/Meta";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu"),
});

const Login = () => {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state?.auth);
  const { isLoading, user } = authState;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(login(values)).unwrap();
        // Nếu login thành công, lấy giỏ hàng ngay lập tức
        if (result) {
          dispatch(getUserCart());
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  });

  return (
    <>
        <Meta title="Đăng nhập" />

      {user?._id && <Navigate to="/" replace={true} />}
      <form
        onSubmit={formik.handleSubmit}
        className="items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <div className="inline-flex justify-center w-[100%] items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl align-center">Đăng nhập</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        <div className="mb-3">
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
          />

          <div className="text-red-600 text-sm italic">
            {formik.touched.email && formik.errors.email ? (
              <p className="mb-0">{formik.errors.email}</p>
            ) : null}
          </div>
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Mật khẩu"
            value={formik.values.password}
            onChange={formik.handleChange("password")}
            onBlur={formik.handleBlur("password")}
          />
          <div className="text-red-600 text-sm italic">
            {formik.touched.password && formik.errors.password ? (
              <p className="mb-0">{formik.errors.password}</p>
            ) : null}
          </div>
        </div>
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <Link to="/forgot-password" className="cursor-pointer">
            Quên mật khẩu?
          </Link>
        </div>
        <button className="bg-black  text-white font-light px-8 py-2 mt-4 w-full">
          Đăng nhập
        </button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Bạn chưa có tài khoản?{" "}
          <Link to='/register' className="font-medium text-gray-900">
            Đăng ký
          </Link>
        </Typography>
      </form>
    </>
  );
};

export default Login;
