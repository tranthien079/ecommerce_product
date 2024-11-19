import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../redux/user/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Input, Typography } from "@material-tailwind/react";
import Meta from "../components/Meta";

const validationSchema = Yup.object({
  code: Yup.string()
    .matches(/^\d+$/, "Mã xác thực phải là số")
    .min(6, "Mã xác thực gồm 6 số")
    .max(6, "Mã xác thực gồm 6 số"),
});

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state?.auth);
  const { isSuccess, verifiedEmail, isLoading } = userState;
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, "");
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  function handleBackspace(event, index) {
    if (event.key === "Backspace" && !event.target.value && index > 0) {
      console.log(inputRefs.current[index - 1]);
      inputRefs.current[index - 1].focus();
    }
  }

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      values.code = otp.join("");
      await dispatch(verifyEmail(values));
      resetForm();
    },
  });

  useEffect(() => {
    if (isSuccess && verifiedEmail) {
      toast.success("Xác thực email thành công");
      navigate("/login");
    }
  }, [isSuccess, verifiedEmail]);

  return (
    <div>
          <Meta title="Xác thực email" />

      <div className="py-5 ">
        <div className="container mx-auto px-4 mt-8 max-w-7xl">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold text-center mb-4">
                  Xác thực email
                </h3>
                <p className="text-center text-gray-600 mb-6">
                  Hãy nhập mã xác thực đã được gửi qua email đăng ký
                </p>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div>
                    <div className="flex justify-center gap-2">
                      <div className="w-full max-w-sm">
                        <div className="my-4 flex items-center justify-center gap-2">
                          {otp.map((digit, index) => (
                            <React.Fragment key={index}>
                              <Input
                                type="text"
                                maxLength={1}
                                className="!w-10 appearance-none !border-t-blue-gray-200 text-center !text-lg placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900"
                                labelProps={{
                                  className:
                                    "before:content-none after:content-none",
                                }}
                                containerProps={{
                                  className: "!min-w-0 !w-10 !shrink-0",
                                }}
                                value={digit}
                                onChange={(e) =>
                                  handleChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleBackspace(e, index)}
                                inputRef={(el) =>
                                  (inputRefs.current[index] = el)
                                }
                              />
                              {index === 2 && (
                                <span className="text-2xl text-slate-700">
                                  -
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                    {formik.touched.code && formik.errors.code && (
                      <p className="mt-2 text-sm text-red-500 text-center">
                        {formik.errors.code}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-700 
                               focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
                               transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center space-x-2"
                    >
                      {isLoading && (
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                        >
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
                      <span>Xác nhận</span>
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

export default VerifyEmail;
