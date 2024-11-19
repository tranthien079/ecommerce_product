import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlog } from "../redux/blog/blogSlice";
import { getAllbcategory } from "../redux/blog/bcategorySlice";
import { List, ListItem, Card } from "@material-tailwind/react";
import Meta from '../components/Meta'
const Blog = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState(null);
  useEffect(() => {
    getBlogCategory();
  }, [dispatch]);

  useEffect(() => {
    getBlogs();
  }, [category]);

  const getBlogs = () => {
    dispatch(getAllBlog(category?.id));
  };

  const getBlogCategory = () => {
    dispatch(getAllbcategory());
  };

  const blogState = useSelector((state) => state?.blog?.blog);

  const bCategoryState = useSelector((state) => state?.bcategory?.bcategory);

  return (
    <div className="flex justify-center gap-6 p-4">
      {/* Sidebar */}
      <Meta title="Bài viết" />
      <div className="w-full md:w-3/12 mb-6 md:mb-0">
        <Card className="w-full">
          <List>
          {bCategoryState &&
                      bCategoryState?.map((b, index) => {
                        return <ListItem
                        key={index}
                        onClick={() =>
                          category?.id === b._id
                            ? setCategory(null) 
                            : setCategory({ id: b._id, name: b.name }) 
                        }
                        className={category?.id === b._id ? "text-info" : ""} 
                      >{b?.name}</ListItem>;
                      })
                    }
           
          </List>
        </Card>
      </div>

      {/* Blog Grid */}
      <div className="w-full md:w-9/12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogState.length > 0 ?
            blogState.map((item, index) => {
              return (
                <div className="mb-6" key={index}>
                  <BlogCard
                    id={item?._id}
                    title={item?.title}
                    description={item?.description}
                    createdAt={item?.createdAt}
                    image={item?.images[0]?.url}
                    data={blogState}
                  />
                </div>
              );
            }) : 'Không tìm thấy bài viết liên quan.'}
        </div>
      </div>
    </div>
  );
};

export default Blog;
