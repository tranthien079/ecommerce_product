import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateUserInfo } from '../redux/user/userSlice';
import Meta from '../components/Meta';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user); // Get user info from Redux
  // Validation schema using Yup
  const validationSchema = Yup.object({
    firstname: Yup.string().required('Vui lòng nhập họ đệm'),
    lastname: Yup.string().required('Vui lòng nhập tên'),
    mobile: Yup.string()
      .required('Vui lòng nhập số điện thoại')
      .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 số'),
    email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    address: Yup.string().required('Vui lòng nhập địa chỉ')
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    await dispatch(updateUserInfo(values)); 
  };
  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorClasses = "mt-1 text-sm text-red-600";
  return (
    <div className="border p-8 rounded-lg bg-white ">
          <Meta title="Hồ sơ" />

      <h1 className='text-center text-xl'>Cập nhật thông tin khách hàng</h1>
      <Formik
        initialValues={{
          firstname: user?.firstname || '',
          lastname: user?.lastname || '',
          mobile: user?.mobile || '',
          email: user?.email || '',
          address: user?.address || ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="firstname" className={labelClasses}>
                Họ đệm
              </label>
              <Field 
                name="firstname" 
                type="text" 
                className={inputClasses}
              />
              <ErrorMessage 
                name="firstname" 
                component="div" 
                className={errorClasses}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="lastname" className={labelClasses}>
                Tên
              </label>
              <Field 
                name="lastname" 
                type="text" 
                className={inputClasses}
              />
              <ErrorMessage 
                name="lastname" 
                component="div" 
                className={errorClasses}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="mobile" className={labelClasses}>
                Số điện thoại
              </label>
              <Field 
                name="mobile" 
                type="text" 
                className={inputClasses}
              />
              <ErrorMessage 
                name="mobile" 
                component="div" 
                className={errorClasses}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className={labelClasses}>
                Email
              </label>
              <Field 
                name="email" 
                type="email" 
                className={inputClasses}
              />
              <ErrorMessage 
                name="email" 
                component="div" 
                className={errorClasses}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label htmlFor="address" className={labelClasses}>
                Địa chỉ
              </label>
              <Field 
                name="address" 
                type="text" 
                className={inputClasses}
              />
              <ErrorMessage 
                name="address" 
                component="div" 
                className={errorClasses}
              />
            </div>

            <div className="md:col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Loading...' : 'Lưu'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Profile;