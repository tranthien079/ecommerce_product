import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
        <img 
      src="https://res.cloudinary.com/dlj4bcepa/image/upload/v1732072178/logo2_gvv9id.svg" 
      alt="Logo" 
      className="w-36 filter mb-5 invert"
    />
            <p className='w-full md:w-2/3 text-gray-600'>
            Chúng tôi luôn lắng nghe bạn <br />
Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>Dịch vụ khách hàng</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <Link to='/chinh-sach-bao-mat'>Chính sách bảo mật</Link>
                <Link to='/chinh-sach-giao-nhan-hang-online'>Chính sách thanh toán, giao nhận</Link>
                <Link to='/bang-size-chuan'>Hướng dẫn chọn size</Link>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>Về STS</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <Link to='/contact'>Liên hệ</Link>
                <Link to='/blog'>Tin tức</Link>
            </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024@ shop-ecommerce-sts.onrender.com - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
