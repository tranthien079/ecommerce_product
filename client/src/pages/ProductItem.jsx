import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { getUserWishlist } from "../redux/user/userSlice";
import {
  addToWishList,
  getProductById,
  getRelatedProducts,
  ratingProduct,
  resetState,
} from "../redux/product/productSlice";
import { toast } from "react-toastify";
import { addProductCart, getUserCart } from "../redux/user/userSlice";
import { formatPrice } from "../utils/helper";
import {
  Input,
  IconButton,
  Rating,
  Card,
  CardHeader,
  CardBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import Meta from "../components/Meta";
import ProductImagesSlider from "../components/ProductImageSlider";

const ProductItem = () => {
  const [selectSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSku, setSelectedSku] = useState("");
  const [stockProduct, setStockProduct] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getProductId = location.pathname.split("/")[2];
  const wishlistState = useSelector(
    (state) => state?.auth?.userWishlist?.wishlist
  );

  useEffect(() => {
    getWishList();
  }, []);

  const getWishList = () => {
    dispatch(getUserWishlist());
  };
  const productState = useSelector(
    (state) => state?.product?.gotProduct?.productWithStock
  );

  const authState = useSelector((state) => state?.auth?.user);
  const totalRating = productState?.totalrating;
  const productSizes = useSelector(
    (state) => state?.product?.gotProduct?.sizes
  );
  const productColors = useSelector(
    (state) => state?.product?.gotProduct?.colors
  );
  const relatedProducts = useSelector(
    (state) => state?.product?.relatedProduct
  );

  const [selectColor, setSelectedColor] = useState();
  const productVariants = useSelector(
    (state) => state?.product?.gotProduct?.productWithStock?.variants
  );

  const [mainImage, setMainImage] = useState(null);

  const handleThumbnailClick = (url) => {
    setMainImage(url);
  };

  const addToWL = (id) => {
    dispatch(addToWishList(id));
    toast.success("Thêm sản phẩm vào wishlist thành công");
  };

  useEffect(() => {
    if (getProductId) {
      const getProduct = async () => {
        setIsLoading(true);
        try {
          await dispatch(getProductById(getProductId)); 
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false); 
        }
      };
      getProduct();
    }
  }, [getProductId, dispatch]);

  useEffect(() => {
    if (productState) {
      const categoryId = productState?.categoryId?._id;
      const data = { productId: getProductId, categoryId: categoryId };
      dispatch(getRelatedProducts(data));
    }
  }, [getProductId, productState]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [getProductId]);

  // Tự động set Color đầu tiên của product
  useEffect(() => {
    if (productColors?.length > 0) {
      setSelectedColor(productColors[0]); // lấy giá trị color đầu tiên
    }
  }, [productColors]);

  // Chức năng tìm SKU biến thể và tồn kho
  const findVariant = () => {
    if (selectColor && selectSize && productVariants) {
      const selectedVariant = productVariants.find(
        (variant) =>
          variant.color === selectColor && variant.size === selectSize
      );
      if (selectedVariant) {
        setSelectedSku(selectedVariant.sku); // Set SKU
        setStockProduct(selectedVariant.stock); // Set stock
      } else {
        setSelectedSku(""); // xóa sku
        setStockProduct(0); // xoa stock
      }
    }
  };

  useEffect(() => {
    findVariant();
  }, [selectColor, selectSize]);

  // Nhận kích cỡ có sẵn dựa trên màu đã chọn
  const getAvailableSizes = () => {
    if (selectColor && productVariants) {
      const availableSizes = productVariants
        .filter((variant) => variant.color === selectColor && variant.stock > 0)
        .map((variant) => variant.size);
      return availableSizes;
    }
    return [];
  };
  const handleLogin = () => {
    navigate('/login')
  }
  // thêm vào giỏ hàng
  const addCart = () => {
    if (selectColor == null) {
      toast.error("Vui lòng chọn màu sản phẩm");
      return;
    }
    if (selectSize == null) {
      toast.error("Vui lòng chọn kích thước sản phẩm");
      return;
    }
    if (quantity == 0) {
      toast.error("Vui lòng nhập số lượng lớn hơn 0");
      return;
    }
    if (selectColor !== null && selectSize !== null && quantity !== 0) {
      dispatch(
        addProductCart({
          productId: productState?._id,
          quantity,
          color:
            productState?.variants?.find(
              (variant) => variant.sku === selectedSku
            )?.colorCode || "",
          size: selectSize,
          sku: selectedSku,
          price:
            productState?.discountPrice > 0
              ? productState?.discountPrice
              : productState?.price,
        })
      );
      dispatch(getUserCart());
    }
  };

  const [star, setStar] = useState(null);
  const [comment, setComment] = useState(null);

  const addRatingProduct = async () => {
    if (authState.length == 0) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    if (star === null) {
      toast.error("Vui lòng chọn sao đánh giá");
      return;
    } else if (comment === null) {
      toast.error("Vui lòng nhập bình luận");
      return;
    } else {
      await dispatch(
        ratingProduct({ star: star, productId: getProductId, comment: comment })
      );
      await dispatch(getProductById(getProductId));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="blue" className="text-center" />
      </div>
    );
  }

  return productState ? (
    <div>
      <Meta title={productState?.name} />
      <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                width: '500px',
                backgroundColor: '#fff',
                padding: '20px'
            }}>
                <ProductImagesSlider  images ={productState?.images}/>
            </div>
        </div>
        {/* Product Data */}
        <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
          {/* Product Images */}
      
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[10%] w-full">
              {productState?.images?.map((image, index) => (
                <img
                  key={index}
                  src={image?.url}
                  alt={`Thumbnail ${index}`}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  onClick={() => handleThumbnailClick(image.url)}
                />
              ))}
            </div>
            <div className="w-full sm:w-[90%]">
              <img
                className="w-full h-auto"
                src={mainImage ? mainImage : productState?.images[0]?.url}
                alt=""
              />
            </div>
          </div>
          {/* --------Product Info-------- */}
          <div className="flex-1">
            <h1 className="font-medium text-2xl mt-2">{productState?.name}</h1>
            <div className=" flex items-center gap-1 mt-2">
              <Rating
                unratedColor="amber"
                ratedColor="amber"
                readonly
                value={totalRating || 0}
              />
              <p className="pl-2 text-gray-400">({productState?.ratings.length}) |</p>{" "}
              <span> Đã bán {productState?.sold}</span>
            </div>
            <div className="flex items-center space-x-2 mt-5">
              {productState?.discountPrice > 0 ? (
                <>
                  <span className="line-through text-gray-500">
                    {formatPrice(productState?.price)}
                  </span>
                  <span className="text-red-500 text-3xl font-semibold">
                    {formatPrice(productState?.discountPrice)}
                  </span>
                </>
              ) : (
                <span className="text-black text-3xl font-semibold">
                  {formatPrice(productState?.price)}
                </span>
              )}
            </div>

            <div className="flex flex-row gap-4 my-4">
              <span className="font-medium">Thương hiệu:</span>
              <span>{productState?.brandId?.name}</span>
            </div>
            <div className="flex flex-row gap-4 my-4">
              <span className="font-medium">Danh mục sản phẩm:</span>
              <span>{productState?.categoryId?.name}</span>
            </div>
            <div className="flex flex-col gap-4 my-4">
              <p>Chọn màu sắc</p>
              <div className="flex gap-2">
                {productColors?.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 ml-2 rounded-full border-2 relative ${
                      color === selectColor
                        ? "border-gray-800"
                        : "border-gray-200"
                    }`}
                    style={{
                      backgroundColor: color,
                      boxShadow:
                        color === selectColor
                          ? "0 0 0 5px white, 0 0 0 6px #1F2937"
                          : "",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 my-4">
              <p>Chọn kích thước</p>
              <div className="flex gap-2">
                {productSizes?.map((size, index) => (
                  <span
                    key={index}
                    className={`border py-2 px-4 bg-gray-100 ${
                      selectSize === size ? "border-gray-700" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      opacity: getAvailableSizes().includes(size) ? 1 : 0.5,
                      pointerEvents: getAvailableSizes().includes(size)
                        ? "auto"
                        : "none",
                    }}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 my-2">
              <p>Số lượng</p>
              <div className="flex gap-2">
                <div className="w-25">
                  <div className="relative w-full">
                    <Input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="!border-t-blue-gray-200  placeholder:text-blue-gray-300 placeholder:opacity-100  focus:!border-t-gray-900 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      containerProps={{
                        className: "min-w-200",
                      }}
                    />
                    <div className="absolute right-1 top-1 flex gap-0.5">
                      <IconButton
                        size="sm"
                        className="rounded"
                        onClick={() =>
                          setQuantity((cur) => Math.max(1, cur - 1))
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
                        </svg>
                      </IconButton>
                      <IconButton
                        size="sm"
                        className="rounded"
                        onClick={() => setQuantity((cur) => cur + 1)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                        </svg>
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
            <div className={`gap-10 flex-column mt-0 mb-1 ${selectedSku ? 'd-flex' : 'invisible'}`}>
              <h3 className="product-heading">SKU: {selectedSku}</h3>
              <p className="product-data fs-5">Tồn kho: {stockProduct}</p>
            </div>
            
            {/* <button
              onClick={addCart}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button> */}
         <button
              onClick={ authState?._id ?  addCart : handleLogin}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="inline-block mr-2 size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              Thêm vào giỏ
            </button> 
          
            {!wishlistState?.some(
                    (item) => item._id === getProductId
                  ) && authState?._id && (
            <button
              onClick={() => addToWL(productState?._id)}
              className="w-full bg-gray-300 text-black py-3 mt-2 rounded hover:bg-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 inline-block mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              Thêm vào wishlist
            </button>
             )}
            <hr className="mt-8 sm:w-4/5" />
            <div className="text-md  mt-5 flex flex-col gap-1">
              <div className="container mt-4 px-2 rounded-3">
                <ul className="list-none mt-3">
                  <li className="mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 h-6 w-6 text-gray-600 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                    <strong className="mr-1">Thanh toán:</strong> Đơn giản và
                    nhanh chóng
                  </li>
                  <li className="mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 h-6 w-6 text-gray-600 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                      />
                    </svg>
                    <strong className="mr-1">Giao hàng:</strong> Từ 3 - 5 ngày
                    trên cả nước
                  </li>
                  <li className="mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 h-6 w-6 text-gray-600 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                    <strong className="mr-1">Miễn phí đổi trả:</strong> Tại 267+
                    cửa hàng trong 15 ngày
                  </li>
                  <li className="mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 h-6 w-6 text-gray-600 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                      />
                    </svg>
                    Sử dụng mã giảm giá ở bước thanh toán
                  </li>
                  <li className="mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 h-6 w-6 text-gray-600 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
                    Thông tin bảo mật và mã hóa
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* -------- Description & Review  Section ------- */}
        <div className="mt-20">
          <div className="flex">
            <h1 className=" py-3 text-3xl">Mô tả sản phẩm</h1>
          </div>
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p
              dangerouslySetInnerHTML={{
                __html: productState?.description,
              }}
            ></p>
          </div>
        </div>
      </div>

      {/* Review section */}
      <div className="py-8">
        <div className="">
          <h2 className="text-xl font-semibold">Đánh giá sản phẩm</h2>
          <div className="mt-6">
            <Rating
              unratedColor="amber"
              ratedColor="amber"
              onChange={(newRating) => setStar(newRating)}
              // value={totalRating || 0}

            />
            <textarea
              placeholder="Viết bình luận của bạn..."
              className="w-full mt-4 p-3 border rounded"
              rows="4"
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={addRatingProduct}
              className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 "
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
      <div>
        {productState?.ratings?.map((rating, index) => {
          if (rating?.isShow === true) {
            return (
              <Card
                color="transparent"
                key={index}
                shadow={false}
                className="w-full  border-b-2"
              >
                <CardHeader
                  color="transparent"
                  floated={false}
                  shadow={false}
                  className="mx-0 flex items-center gap-4 pt-0 pb-8"
                >
                  <div className="flex w-full flex-col gap-0.5">
                    <div className="flex items-center ">
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mr-2"
                      >
                        {rating?.postedBy?.firstname}
                        {rating?.postedBy?.lastname}
                      </Typography>

                      <Rating
                        value={Number(rating?.star) || 0}
                        readonly
                        unratedColor="amber"
                        ratedColor="amber"
                      />
                    </div>
                    <Typography color="blue-gray">{rating?.comment}</Typography>
                  </div>
                </CardHeader>
              </Card>
            );
          }
        })}
      </div>
      <div className="py-6 px-2 ">
        <div className="">
          <h1 className="text-3xl font-semibold">Sản phẩm liên quan</h1>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mt-6">
            <ProductCard data={relatedProducts} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className=" opacity-0"></div>
  );
};

export default ProductItem;
