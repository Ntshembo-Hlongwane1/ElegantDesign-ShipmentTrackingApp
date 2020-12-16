import React from "react";
import BannerImg from "../images/banner.jpg";
import "../StyleSheet/Banner.css";

const Banner = () => {
  return (
    <div className="Banner">
      <img src={BannerImg} alt="Home Banner" className="HomeBanner" />
    </div>
  );
};

export default Banner;
