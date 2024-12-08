import React, { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/user/userSlice";
import { Typography } from "@material-tailwind/react";
import Meta from "../components/Meta";

const signUpSchema = yup.object({
  firstname: yup.string().required("Vui lòng nhập họ đệm"),
  lastname: yup.string().required("Vui lòng nhập tên"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải ít nhất 6 ký tự")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Mật khẩu phải bao gồm chữ thường, chữ in hoa, số và ký tự đặc biệt")
    .required("Vui lòng nhập mật khẩu mới"),
  mobile: yup
    .number()
    .min(10, "Số điện thoại tối thiểu 10 số")
    .required("Vui lòng nhập số điện thoại"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerState = useSelector((state) => state?.auth);
  const { isSuccess, isLoading, createdUser } = registerState;

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      mobile: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values, { resetForm }) => {
      await dispatch(register(values));
      resetForm();
    },
  });

  useEffect(() => {
    if (isSuccess && createdUser) {
      navigate("/verify-email");
    }
  }, [isSuccess, createdUser]);

  return (
    <div>
      <Meta title="Đăng ký" />

      <div className="py-5 ">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className=" rounded-lg p-6">
              <div className="inline-flex justify-center w-[100%] items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl align-center">Đăng kí</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="Họ đệm"
                      className="w-full px-3 py-2 border border-gray-800"
                      value={formik.values.firstname}
                      onChange={formik.handleChange("firstname")}
                      onBlur={formik.handleBlur("firstname")}
                    />
                    {formik.touched.firstname && formik.errors.firstname && (
                      <p className="text-red-600 text-sm italic">{formik.errors.firstname}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Tên"
                      className="w-full px-3 py-2 border border-gray-800"
                      value={formik.values.lastname}
                      onChange={formik.handleChange("lastname")}
                      onBlur={formik.handleBlur("lastname")}
                    />
                    {formik.touched.lastname && formik.errors.lastname && (
                      <p className="text-red-600 text-sm italic">{formik.errors.lastname}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-800"
                      value={formik.values.email}
                      onChange={formik.handleChange("email")}
                      onBlur={formik.handleBlur("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-600 text-sm italic">{formik.errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <input
                      type="password"
                      name="password"
                      placeholder="Mật khẩu"
                      className="w-full px-3 py-2 border border-gray-800"
                      value={formik.values.password}
                      onChange={formik.handleChange("password")}
                      onBlur={formik.handleBlur("password")}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-600 text-sm italic">{formik.errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      name="mobile"
                      placeholder="Số điện thoại"
                      className="w-full px-3 py-2 border border-gray-800"
                      value={formik.values.mobile}
                      onChange={formik.handleChange("mobile")}
                      onBlur={formik.handleBlur("mobile")}
                    />
                    {formik.touched.mobile && formik.errors.mobile && (
                      <p className="text-red-600 text-sm italic">{formik.errors.mobile}</p>
                    )}
                  </div>

                  <div className="mt-6 space-y-4">
                    <p className="text-sm text-black">
                      Bạn có tài khoản để{" "}
                      <Link to="/login" className="text-gray-600 hover:text-gray-700">
                        Đăng nhập
                      </Link>
                    </p>
                    <div className="flex justify-center">
                      <button
                        className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-700 
                               focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
                               transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center space-x-2 w-full justify-center"
                        type="submit"
                        disabled={isLoading}
                      >
                       
                        {isLoading && (
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        )}
                        Đăng kí
                      </button>
                    </div>
                  </div>
                </form>
                <Typography color="gray" className="mt-4 text-center font-normal">
          Bạn đã có tài khoản?{" "}
          <Link to='/login' className="font-medium text-gray-900">
            Đăng nhập
          </Link>
        </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
