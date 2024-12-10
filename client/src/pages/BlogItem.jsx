import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getBlogById, resetState } from "../redux/blog/blogSlice";
import { formatDate } from '../utils/helper';
import Meta from '../components/Meta';
import {
  Spinner
} from "@material-tailwind/react";
const BlogItem = () => {
  const dispatch = useDispatch();
  const blogState = useSelector(state => state?.blog?.gotBlog);
  const location = useLocation();
  const getBlogId = location.pathname.split('/')[2];
 const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
      if (getBlogId) {
      const getBlog = async () => {
        setIsLoading(true);
        try {
          await dispatch(getBlogById(getBlogId));
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false); 
        }
      };
      getBlog();
    }
  }, [dispatch, getBlogId]);

   if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="blue" className="text-center" />
      </div>
    );
  }
  return (
    <div>
      <Meta title={blogState?.title} />
      <div className="py-5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Link 
                to='/blog' 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

                <span>Back</span>
              </Link>

              <h3 className="text-2xl font-bold my-4">
                {blogState?.title}
              </h3>

              <div className="flex items-center gap-4 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

                  <span>
                    {blogState?.author !== 'Admin' 
                      ? `${blogState?.author?.firstname} ${blogState?.author?.lastname}`
                      : 'Admin'
                    }
                  </span>
                </div>

                <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
</svg>

                  <span>{formatDate(blogState?.createdAt)}</span>
                </div>
              </div>

              {blogState?.images?.[0]?.url && (
                <img 
                  src={blogState.images[0].url}
                  alt={blogState?.title || 'Blog post image'}
                  className="w-full h-[500px] object-cover rounded-lg mb-6"
                />
              )}

              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: blogState?.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
