import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import Meta from '../components/Meta'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div>
      <Meta title="Về chúng tôi" />
        <div className="container-xxl">
      <div className="row ">
        <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
          <div className="item" id="87">
            <h2 className="heading">
              <a
                href="/ve-chung-toi/cau-chuyen-cua-sts-ad87.html"
                title="Câu chuyện của STS"
                className="title-about"
              >
                Câu chuyện của STS
              </a>
            </h2>
            <div className="short-description">
              <p style={{ textAlign:'center'}}>
                <img
                  style={{ width: '100%' }}
                  alt=""
                  src="https://stsgroup.org.vn/UserUpload/Editor/VE-CHUNG-TOI-1.png"
                />
              </p>
              <p style={{ textAlign:'center'}}>
                <img
                  style={{ width: '100%' }}
                  alt=""
                  src="https://stsgroup.org.vn/UserUpload/Editor/VE-CHUNG-TOI-2.png"
                />
              </p>
              <p>&nbsp;</p>
            </div>
            <div className="description"></div>
          </div>
          <div className="item" id="130">
            <h2 className="heading">
              <a
                href="/ve-chung-toi/gioi-thieu-chung-ad130.html"
                title="Giới thiệu chung"
                className="title-about"
              >
                Giới thiệu chung
              </a>
            </h2>
            <div className="short-description">
              <p dir="ltr">
                STS ra mắt cổng thông tin chuyên ngành dệt may, trực tuyến, miễn
                phí, và các công cụ phân tích, có thể giúp doanh nghiệp loại bỏ
                một số phỏng đoán trong việc lựa chọn thị trường xuất khẩu.
              </p>
            </div>
            <div className="description"></div>
          </div>
          <div className="item" id="131">
            <h2 className="heading">
              <a
                href="/ve-chung-toi/tam-nhin-muc-tieu-va-gia-tri-cot-loi-ad131.html"
                title="Tầm nhìn, mục tiêu và giá trị cốt lõi"
                className="title-about"
              >
                Tầm nhìn, mục tiêu và giá trị cốt lõi
              </a>
            </h2>
            <div className="short-description">
              <p style={{ textAlign:'center'}}>
                <img
                  style={{ width: '100%' }}
                  alt=""
                  src="https://stsgroup.org.vn/UserUpload/Editor/VE-CHUNG-TOI-3-1.png"
                />
              </p>
              <p>&nbsp;</p>
            </div>
            <div className="description"></div>
          </div>
          <div className="item" id="132">
            <h2 className="heading">
              <a href="/ve-chung-toi/doi-ngu-ad132.html" title="Đội ngũ"     className="title-about">
                Đội ngũ
              </a>
            </h2>
            <div className="short-description">
              <p dir="ltr" style={{ textAlign:'justify'}}>
                STS được dẫn dắt bởi một đội ngũ chuyên gia có tầm nhìn xa và đa
                dạng trong nhiều lĩnh vực với hơn “150 năm” kinh nghiệm hợp
                nhất, đang hoạt động chặt chẽ với tất cả các lĩnh vực của chuỗi
                cung ứng dệt may.
              </p>
              <div>
                <p>
                  <img
                    style={{ width: '100%' }}
                    src="https://stsgroup.org.vn/UserUpload/Editor/profile-thay-hinh-27-2.jpg"
                  />
                </p>
              </div>
            </div>
            <div className="description"></div>
          </div>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <ul className="heading-list">
            <li>
              {/* <BiBrightness size={30} /> */}
              <a href="#87">Câu chuyện của STS</a>
            </li>
            <li>
            {/* <BiBrightness size={30} /> */}
              <a href="#130">Giới thiệu chung</a>
            </li>
            <li>
            {/* <BiBrightness size={30} /> */}
              <a href="#131">Tầm nhìn, mục tiêu và giá trị cốt lõi</a>
            </li>
            <li>
            {/* <BiBrightness size={30} /> */}
              <a href="#132">Đội ngũ</a>
            </li>
            <li>
            {/* <BiBrightness size={30} /> */}
              <Link to="/contact">Liên hệ với chúng tôi</Link>
            </li>
          </ul>
        </div>
      </div>
      </div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
            <p>Anh Núi giờ đây đã công thành danh toại ở một cương vị mới: Cục trưởng Cục nghệ thuật biểu diễn, ông Đại đã nở mày nở mặt chưa 😅😅.</p>
            <p>Anh Núi giờ đây đã công thành danh toại ở một cương vị mới: Cục trưởng Cục nghệ thuật biểu diễn, ông Đại đã nở mày nở mặt chưa 😅😅.</p>
            <b className='text-gray-800'>Our Mission</b>
            <p>Anh Núi giờ đây đã công thành danh toại ở một cương vị mới: Cục trưởng Cục nghệ thuật biểu diễn, ông Đại đã nở mày nở mặt chưa 😅😅.</p>
          </div>
      </div>
      <div className=' text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Anh Núi giờ đây đã công thành danh toại ở một cương vị mới: Cục trưởng Cục nghệ thuật biểu diễn, ông Đại đã nở mày nở mặt chưa 😅😅.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Anh Núi giờ đây đã công thành danh toại ở một cương vị mới: Cục trưởng Cục nghệ thuật biểu diễn, ông Đại đã nở mày nở mặt chưa 😅😅.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Anh Núi giờ đây đã công thành danh toại ở một cương vị mới: Cục trưởng Cục nghệ thuật biểu diễn, ông Đại đã nở mày nở mặt chưa 😅😅.</p>
        </div>
      </div>

      <NewsletterBox />
      
    </div>
  )
}

export default About
