import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { changePasswordToken } from "../redux/user/userSlice";
import { useLocation } from "react-router-dom";
import Meta from "../components/Meta";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Mật khẩu phải bao gồm chữ thường, chữ in hoa, số và ký tự đặc biệt")
    .required("Vui lòng nhập mật khẩu mới"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

const ResetPassword = () => {
  const location = useLocation();
  const token = location.pathname.split("/")[2];
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      password: "",
      passwordConfirm: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = { ...values, token }
      dispatch(changePasswordToken(data));
      resetForm();
    },
  });

  return (
    <div>
      <Meta title="Khôi phục mật khẩu" />

      <div className="py-5 ">
        <div className="container mx-auto px-4 mt-8">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold text-center mb-6">
                  Đổi mật khẩu mới
                </h3>
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col space-y-4"
                >
                  <div className="flex flex-col">
                    <label 
                      htmlFor="password" 
                      className="text-gray-700 mb-1"
                    >
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Nhập mật khẩu mới"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-500 text-sm mt-1 italic">
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col">
                    <label 
                      htmlFor="passwordConfirm" 
                      className="text-gray-700 mb-1"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      name="passwordConfirm"
                      placeholder="Nhập xác nhận mật khẩu"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      value={formik.values.passwordConfirm}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.passwordConfirm && formik.errors.passwordConfirm ? (
                      <div className="text-red-500 text-sm mt-1 italic">
                        {formik.errors.passwordConfirm}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;