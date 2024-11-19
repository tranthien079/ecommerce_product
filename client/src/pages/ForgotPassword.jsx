import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../redux/user/userSlice";
import Meta from "../components/Meta";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
});

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(forgotPassword(values));
      resetForm();
    },
  });

  return (
    <div>
          <Meta title="Quên mật khẩu" />

      <div className="py-5 ">
        <div className="container mx-auto px-4 max-w-7xl mt-8">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold text-center mb-4">
                  Thiết lập lại mật khẩu
                </h3>
                <p className="text-center text-gray-600 mb-6">
                  Bạn sẽ nhận được link đổi mật khẩu mới qua email.
                </p>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="Nhập email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-colors"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-sm italic">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-black text-white rounded-md 
                               hover:bg-gray-700 focus:outline-none focus:ring-2 
                               focus:ring-gray-500 focus:ring-offset-2
                               transition-colors"
                    >
                      Đặt lại mật khẩu
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

export default ForgotPassword;