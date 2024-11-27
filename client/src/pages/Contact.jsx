import React from "react";
import {
  HomeIcon,
  EnvelopeIcon,
  PhoneIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { base_url } from "../utils/base_url";
import Meta from "../components/Meta";
// Yup schema for validation
const contactSchema = Yup.object().shape({
  name: Yup.string().required("Họ và tên không được để trống"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại không được để trống"),
  message: Yup.string().required("Lời nhắn không được để trống"),
});

const Contact = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    validationSchema: contactSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(`${base_url}user/send-mail`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          resetForm();
          toast.success("Gửi liên hệ thành công!");
        } else {
          toast.error("Gửi không thành công!");
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
        toast.error("Đã xảy ra lỗi khi gửi form.");
      }
    },
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Meta title="Liên hệ" />
      <div className="container mx-auto px-4 py-8">
        {/* Google Maps Embed */}
        <div className="mb-8 w-full">
         
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5383987660434!2d106.72173382334341!3d10.770014166358603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317525f50ef61f35%3A0x7859967bd3302bf7!2zQ8SDbiBo4buZIGNhbyBj4bqlcCBTYXJpY2EgQ29uZG9taW5pdW0gLSBraHUgxJHDtCB0aOG7iyBTYWxh!5e0!3m2!1svi!2s!4v1732706253432!5m2!1svi!2s"    className="w-full h-96 border-0 rounded-lg shadow-md"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Liên hệ</h3>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Họ và tên"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </div>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Số điện thoại"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.phone}
                  </div>
                )}
              </div>
              <div>
                <textarea
                  name="message"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lời nhắn"
                  rows="6"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></textarea>
                {formik.touched.message && formik.errors.message && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.message}
                  </div>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-black  text-white font-light px-8 py-2 mt-4 w-full transition duration-300"
                >
                  Gửi
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Địa chỉ</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <HomeIcon className="h-6 w-6 text-gray-800" />
                <address className="text-gray-700 not-italic">
                  Văn Phòng: A07-08 tòa Sarica, Đ. D9, KĐT Sala, P. An Lợi Đông,
                  Q.2, TP. HCM.
                </address>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneIcon className="h-6 w-6 text-gray-800" />
                <a
                  href="tel:+84818872887"
                  className="text-gray-700 hover:text-blue-600"
                >
                  +84 8 1887 2887
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <EnvelopeIcon className="h-6 w-6 text-gray-800" />
                <a
                  href="mailto:info@stsgroup.org.vn"
                  className="text-gray-700 hover:text-blue-600"
                >
                  info@stsgroup.org.vn
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <InformationCircleIcon className="h-6 w-6 text-gray-800" />
                <p className="text-gray-700">Thứ hai - Thứ sáu 9AM - 5PM</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
