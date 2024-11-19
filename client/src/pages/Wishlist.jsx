import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserWishlist } from "../redux/user/userSlice";
import { addToWishList } from "../redux/product/productSlice";
import { toast } from "react-toastify";
import { formatPrice } from "../utils/helper";
import ProductCard from "../components/ProductCard";
import { Badge, Rating, Spinner } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import Meta from "../components/Meta";

const Wishlist = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const wishlistState = useSelector(
    (state) => state?.auth?.userWishlist?.wishlist
  );

  useEffect(() => {
    const getWishlist = async () => {
      setIsLoading(true);
      await dispatch(getUserWishlist());
      setIsLoading(false);
    };

    getWishlist();
  }, [dispatch]);

  const removeWishList = async (id) => {
    await dispatch(addToWishList(id));
    await dispatch(getUserWishlist());
    toast.success("Xóa sản phẩm yêu thích thành công");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="blue" className="text-center" />
      </div>
    );
  }

  return (
    <div className="py-6 px-2">
      <Meta title="Sản phẩm yêu thích" />

      <div>
        <h1 className="text-3xl font-semibold text-center">
          Danh sách sản phẩm yêu thích
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mt-6">
          {wishlistState?.map((item, index) => {
            return (
              <div
                key={index}
                className="block relative bg-white shadow-md rounded-lg overflow-hidden"
              >
                {/* Wishlist Badge */}
                <div className="absolute top-0 right-6 z-30 ">
                  {item?.discountPrice > 0 && (
                    <Badge
                      color="red"
                      className=" "
                      content={`  -${Math.round(
                        ((item.price - item.discountPrice) / item.price) * 100
                      )}%`}
                    ></Badge>
                  )}
                </div>
                <div className="absolute top-0 left-1 z-30 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8"
                    onClick={() => removeWishList(item?._id)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                {/* Product Images */}
                <div className="relative overflow-hidden">
                  <img
                    src={item?.images[0]?.url}
                    alt="product"
                    className="w-full h-full object-cover transition-transform transform hover:scale-105"
                  />
                  <img
                    src={item?.images[1]?.url}
                    alt="product alternate"
                    className="w-full h-full object-cover transition-transform transform hover:scale-105 hidden"
                  />
                </div>

                {/* Product Details */}
                <Link to={`/product/${item?._id}`}>
                  <div className="p-4">
                    <h6 className="text-sm text-gray-500">
                      {item?.brandId?.name}
                    </h6>
                    <h5 className="text-lg font-medium">{item?.name}</h5>

                    <Rating
                      value={Number(item?.totalrating) || 0}
                      readonly
                      unratedColor="amber"
                      ratedColor="amber"
                    />
                    <p
                      className={`text-sm text-gray-600 ${"hidden"}`}
                      dangerouslySetInnerHTML={{ __html: item?.description }}
                    ></p>

                    {/* Pricing */}
                    {item?.discountPrice > 0 ? (
                      <div className="flex items-center gap-3">
                        <p className="text-gray-400 line-through">
                          {formatPrice(item?.price)}
                        </p>
                        <p className="text-red-500 font-semibold">
                          {formatPrice(item?.discountPrice)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg font-semibold">
                        {formatPrice(item?.price)}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
