import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToWishList } from "../redux/product/productSlice";
import { formatPrice } from "../utils/helper";
import { Badge, Rating } from "@material-tailwind/react";
import { toast } from "react-toastify";
const ProductCard = (props) => {
  const { grid, data } = props;
  const dispatch = useDispatch();
  let location = useLocation();

  const addToWL = (id) => {
    dispatch(addToWishList(id));
  };

  return (
    <>
      {data?.length > 0 ? (
        data.map((item, key) => {
          return (
            <div
              key={key}
         
            >
              <Link
                to={`${
                  location.pathname === "/"
                    ? `/product/${item._id}`
                    : location.pathname === `/product/${item._id}`
                    ? `/product/${item._id}`
                    : `/product/${item._id}`
                }`}
                className="block relative bg-white shadow-md rounded-lg overflow-hidden"
              >
                {/* Wishlist Badge */}
                <div className="absolute top-0 right-6 z-30 ">
                  {item?.discountPrice > 0 && (
                    <Badge
                      color="red"
                      className=" "
                      content= {`  -${Math.round(((item.price - item.discountPrice) / item.price) * 100)}%`}
                    >
                    
                    </Badge>
                  )}
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
                <div className="p-4">
                  <h6 className="text-sm text-gray-500">{item?.brandId?.name}</h6>
                  <h5 className="text-lg font-medium">{item?.name}</h5>
              
                     <Rating value={Number(item?.totalrating) || 0} readonly        unratedColor="amber"
                ratedColor="amber" />
                  <p
                    className={`text-sm text-gray-600 ${
                  "hidden"
                    }`}
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
        })
      ) : (
        <h3 className="text-center text-lg font-bold">Không có sản phẩm cần tìm kiếm</h3>
      )}
    </>
  );
};

export default ProductCard;
