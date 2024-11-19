import React, { useEffect } from "react";
import Hero from "../components/Hero";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import { getAllProduct } from "../redux/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlog } from "../redux/blog/blogSlice";
import ProductCard from "../components/ProductCard";
import BlogCard from "../components/BlogCard";
import Meta from "../components/Meta";
const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getBlogs();
    getProducts();
  }, []);

  const getBlogs = () => {
    dispatch(getAllBlog());
  };

  const getProducts = () => {
    dispatch(
      getAllProduct({
        limit: 10,
      })
    );
  };

  const blogState = useSelector((state) => state?.blog?.blog);
  const productState = useSelector((state) => state?.product);
  return (
    <div>
      <Meta title="Trang chủ" />
      <Hero />
      <OurPolicy />
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl border-b-4 mb-10">Sản phẩm khuyến mãi</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 sm:grid-cols-12 gap-8 mt-6">
          <ProductCard
            data={
              productState.product.length > 0
                ? productState.product.filter(
                    (product) => product.discountPrice > 0
                  )
                : []
            }
          />
        </div>
      </div>
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl border-b-4 mb-10">Sản phẩm mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 sm:grid-cols-12 gap-8 mt-6">
          <ProductCard
            data={
              productState.product.length > 0
                ? productState.product
                    .filter((product) => !product.discountPrice) // Loại bỏ sản phẩm có discountPrice
                    .slice(0, 18) // Lấy 12 sản phẩm đầu tiên
                : []
            }
          />
        </div>
      </div>
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl border-b-4 mb-10">Bài viết gần đây</h2>
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-8 mt-6">
          {blogState &&
            blogState?.map((item, index) => {
              if (index < 4) {
                return (
                  <BlogCard
                    id={item?._id}
                    title={item?.title}
                    description={item?.description}
                    createdAt={item?.createdAt}
                    image={item?.images[0]?.url}
                    data={blogState}
                    key={index}
                  />
                );
              }
            })}
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Home;
