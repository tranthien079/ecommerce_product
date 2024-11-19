import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct, resetState } from "../redux/product/productSlice";
import { getAllBrand } from "../redux/product/brandSlice";
import { getAllCategory } from "../redux/product/categorySlice";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Pagination, Button, IconButton, Spinner } from "@material-tailwind/react";
import Meta from "../components/Meta";
const StorePage = () => {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state?.product);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filter states
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    getProducts();
  }, [sort, category, brand, minPrice, maxPrice, page, limit]);

  const getProducts = () => {
    dispatch(
      getAllProduct({
        sort,
        brandId: brand?.id,
        categoryId: category?.id,
        minPrice,
        maxPrice,
        page,
        limit: limit,
      })
    );
  };

  useEffect(() => {
    dispatch(getAllBrand());
    dispatch(getAllCategory());
  }, [dispatch]);

  const brandState = useSelector((state) => state?.brand?.brand);
  const categoryState = useSelector((state) => state?.category?.category);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  useEffect(() => {
    if (productState?.product) {
      let newBrands = [];
      let newCategories = [];
      for (let i = 0; i < productState.product.length; i++) {
        const element = productState.product[i];
        newBrands.push({
          brandName: element?.brandId?.name,
          brandId: element?.brandId,
        });
        newCategories.push({
          categoryName: element?.categoryId?.name,
          categoryId: element?.categoryId,
        });
      }
      setBrands(newBrands);
      setCategories(newCategories);
      setIsLoadingProduct(false)
    }
  }, [productState.product]);
  // Pagination Handlers
  const totalPages = productState?.totalPages || 1;
  const prev = () => {
    if (page > 1) setPage(page - 1);
  };

  const next = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const getItemProps = (pageNumber) => ({
    onClick: () => setPage(pageNumber),
    className: `text-sm ${
      pageNumber === page
        ? "bg-blue-500 text-white"
        : "bg-gray-200 text-gray-600"
    }`,
  });

  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="blue" className="text-center" />
      </div>
    );
  }

  return (
    <>
        <Meta title="Sản phẩm" />
      <div className="store-wrapper py-5 ">
        <div className="container mx-auto ">
          <div className="flex flex-wrap">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 mb-5">
              {/* Filter by Category */}
              <div className="filter-card bg-white p-4 rounded-lg mb-4 shadow">
                <h3 className="filter-title text-lg font-bold mb-3">
                  Danh mục
                </h3>
                <ul className="space-y-2">
                  {categoryState &&
                    categoryState.map((item, index) => (
                      <li
                        key={index}
                        className={`border-b-2 cursor-pointer ${
                          category?.id === item._id
                            ? "text-blue-600 font-semibold"
                            : "text-gray-600"
                        }`}
                        onClick={() =>
                          category?.id === item._id
                            ? setCategory(null)
                            : setCategory({ id: item._id, name: item.name })
                        }
                      >
                        {item.name}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Filter by Brand */}
              <div className="filter-card bg-white p-4 rounded-lg mb-4 shadow">
                <h3 className="filter-title text-lg font-bold mb-3">
                  Thương hiệu
                </h3>
                <ul className="space-y-2">
                  {brandState &&
                    brandState.map((item, index) => (
                      <li
                        key={index}
                        className={`border-b-2 cursor-pointer ${
                          brand?.id === item._id
                            ? "text-blue-600 font-semibold"
                            : "text-gray-600"
                        }`}
                        onClick={() =>
                          brand?.id === item._id
                            ? setBrand(null)
                            : setBrand({ id: item._id, name: item.name })
                        }
                      >
                        {item.name}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Filter by Price */}
              <div className="filter-card bg-white p-4 rounded-lg shadow">
                <h3 className="filter-title text-lg font-bold mb-3">
                  Giá tiền
                </h3>
                <div className="space-y-2">
                  <div>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Từ giá"
                      min={1}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Đến giá"
                      min={1}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="w-full md:w-3/4 ">
              <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow ml-4">
                {/* Sorting */}
                <div className="flex items-center gap-4 ">
                  <label className="text-sm font-semibold">Sắp xếp theo:</label>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="name">Từ A-Z</option>
                    <option value="-name">Từ Z-A</option>
                    <option value="price">Giá thấp đến cao</option>
                    <option value="-price">Giá cao đến thấp</option>
                    <option value="-createdAt">Mới nhất</option>
                    <option value="createdAt">Cũ nhất</option>
                  </select>
                </div>
                {/* Limit */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold">Hiển thị:</label>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    onChange={(e) => setLimit(e.target.value)}
                  >
                    <option value="6">6 sản phẩm</option>
                    <option value="8">8 sản phẩm</option>
                    <option value="12">12 sản phẩm</option>
                    <option value="16">16 sản phẩm</option>
                  </select>
                </div>
              </div>

              {/* Product List */}
              <div className="ml-4 products-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard
                  data={
                    productState.product.length > 0 ? productState?.product : []
                  }
                />
              </div>

              {/* Pagination */}
              {productState &&   <div className="mt-6 flex justify-center">
                <div className="mt-6 flex justify-center items-center gap-4">
                  <Button
                    variant="text"
                    className="flex items-center gap-2"
                    onClick={prev}
                    disabled={page === 1}
                  >
                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />{" "}
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <IconButton key={index + 1} {...getItemProps(index + 1)}>
                        {index + 1}
                      </IconButton>
                    ))}
                  </div>
                  <Button
                    variant="text"
                    className="flex items-center gap-2"
                    onClick={next}
                    disabled={page === totalPages}
                  >
                    Next
                    <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StorePage;
