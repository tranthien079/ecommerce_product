/* eslint-disable react/prop-types */
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/helper";
const BlogCard = (props) => {
  const { id, title, description, createdAt, image } = props;
  return (
    <Link to={`/blog/${id}`}>
     <Card className="mt-4">
      <CardHeader color="blue-gray" className="relative h-56">
        <img src={image} alt=""  className="object-cover"/>
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {title}
        </Typography>
        <Typography  className="desc"
            dangerouslySetInnerHTML={{
              __html: description.substr(0, 70) + "...",
            }}>

        </Typography>
      </CardBody>
      <CardFooter className="pt-0 flex items-center justify-between">
        <Button>Đọc thêm</Button>
        <p>{formatDate(createdAt)}</p>
      </CardFooter>
    </Card>
    </Link>
  );
};

export default BlogCard;
