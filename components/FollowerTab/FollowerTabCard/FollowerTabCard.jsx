import React, { useState, useContext } from "react";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import Link from "next/link.js";

//IMPORT FROM CONTRACT DATA
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

//INTERNAL IMPORT
import Style from "./FollowerTabCard.module.css";
import Images from "../../../img";
const FollowerTabCard = ({ i, el }) => {
  const [following, setFollowing] = useState(false);
  const { accountBalance } = useContext(NFTMarketplaceContext);

  const followMe = () => {
    if (!following) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  };
  return (
    <div className={Style.FollowerTabCard}>
      <div className={Style.FollowerTabCard_rank}>
        <p>
          #{i + 1} <span>🥇</span>
        </p>
      </div>

      <div className={Style.FollowerTabCard_box}>
        <Link href={{ pathname: "./author" }}>
          <div className={Style.FollowerTabCard_box_img}>
            <Image
              className={Style.FollowerTabCard_box_img_img}
              src={el.background || Images[`creatorbackground${i + 1}`]}
              alt="profile background"
              width={500}
              height={300}
              objectfit="cover"
            />
          </div>
        </Link>

        <div className={Style.FollowerTabCard_box_profile}>
          <Image
            className={Style.FollowerTabCard_box_profile_img}
            alt="profile picture"
            width={50}
            height={50}
            src={el.user || Images[`user${i + 1}`]}
          />
        </div>

        <div className={Style.FollowerTabCard_box_info}>
          <div className={Style.FollowerTabCard_box_info_name}>
            <h4>
              {el.seller.slice(0, 9)}
              {""}{" "}
              <span>
                <MdVerified />
              </span>
            </h4>
            <p>{accountBalance.slice(1, 12)} ETH</p>
          </div>

          {/* <div className={Style.FollowerTabCard_box_info_following}>
            {following ? (
              <a onClick={() => followMe()}>
                Follow{""}{" "}
                <span>
                  <TiTick />
                </span>
              </a>
            ) : (
              <a onClick={() => followMe()}>Following</a>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default FollowerTabCard;
