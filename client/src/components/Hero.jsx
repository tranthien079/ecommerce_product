import React from "react";
import { assets } from "../assets/assets";
import { Carousel } from "@material-tailwind/react";
import banner1 from "../../public/images/banner1.webp";
import banner2 from "../../public/images/banner2.webp";
import banner3 from "../../public/images/banner3.webp";
import banner4 from "../../public/images/banner4.webp";
const Hero = () => {
  return (
    <div className="">
      <Carousel className="rounded-xl" transition={{ duration: 2 }}>
        <img
          src={banner1}
          alt="image 1"
          className="h-full w-full object-cover"
        />
        <img
          src={banner2}
          alt="image 2"
          className="h-full w-full object-cover"
        />
        <img
          src={banner3}
          alt="image 3"
          className="h-full w-full object-cover"
        />
      </Carousel>
    </div>
  );
};

export default Hero;
