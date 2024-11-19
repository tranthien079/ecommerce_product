import React, { useState, useEffect } from "react";
import { Form, Table, Image } from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getBrand } from "../../redux/brand/brandSlice";
import { getCategory } from "../../redux/category/categorySlice";
import { getProductById, resetState } from "../../redux/product/productSlice";
import { useParams } from "react-router-dom";

const DetailProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [sizeOptions, setSizeOptions] = useState([
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
  ]);
  const [existingImages, setExistingImages] = useState([]);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    } else {
      dispatch(resetState());
    }
    dispatch(getBrand());
    dispatch(getCategory());
  }, [dispatch, id]);

  const brandState = useSelector((state) => state.brands.brands);
  const categoryState = useSelector((state) => state.categories.categories);
  const { gotProduct } = useSelector((state) => state.products);

  useEffect(() => {
    if (id && gotProduct) {
      form.setFieldsValue({
        name: gotProduct.name,
        price: gotProduct.price,
        discountPrice: gotProduct.discountPrice,
        categoryId: gotProduct.categoryId,
        brandId: gotProduct.brandId,
        description: gotProduct.description,
      });
      setExistingImages(gotProduct?.images || []);
      setVariants(gotProduct.variants || []);
      console.log(gotProduct.variants);
    }
  }, [form, id, gotProduct]);

  const columns = [
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Color code",
      dataIndex: "colorCode",
      key: "colorCode",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
  ];

  return (
    <div>
      <div className="bg-white p-5 rounded-lg">
        <h3 className="font-semibold">Xem chi tiết sản phẩm</h3>
        <div className="show-img flex gap-3">
          {existingImages.length > 0 &&
            existingImages.map((img, index) => (
              <div key={index} className="mt-2 relative">
                <Image
                  src={img.url}
                  alt="blog"
                  className="object-cover w-[150px] h-[100px]"
                  width={150}
                />
              </div>
            ))}
        </div>
        <div className="mt-5">
          <h4 className="font-semibold mb-3">Mô tả</h4>
          <p
            className=""
            dangerouslySetInnerHTML={{ __html: gotProduct?.description }}
          ></p>
        </div>
        <div className="mt-5">
          <h4 className="font-semibold mb-3">Sản phẩm biến thể</h4>
          <Table columns={columns} dataSource={variants} rowKey="sku" />
        </div>
      </div>
    </div>
  );
};

export default DetailProductPage;
