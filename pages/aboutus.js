import React from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "../styles/aboutus.module.css";
import images from "../img";

const aboutus = () => {
  return (
    <div className={Style.aboutus}>
      <div className={Style.aboutus_box}>
        <div className={Style.aboutus_box_hero}>
          <div className={Style.aboutus_box_hero_left}>
            <h1>👋 About Us.</h1>
            <p>
              Welcome to NFT Market, your go-to destination for exploring and
              collecting unique digital assets through Non-Fungible Tokens
              (NFTs). Our platform is designed to provide a seamless and secure
              experience for both creators and collectors, fostering a
              community-driven ecosystem where everyone can thrive. Welcome to
              NFT Market 🎉🎊
            </p>
          </div>
          <div className={Style.aboutus_box_hero_right}>
            <Image src={images.hero2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default aboutus;
