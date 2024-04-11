import React, { useState } from "react";

//INTERNAL IMPORT
import Style from "./AuthorNFTCardBox.module.css";
import images from "../../img";
import { NFTCardTwo } from "../../collectionPage/collectionIndex";

const AuthorNFTCardBox = ({
  collectiables,
  created,
  // like,
  follower,
  following,
  nfts,
  myNFTs,
}) => {
  // const collectiablesArray = [
  //   images.Man,
  //   images.monk,
  //   images.old1,
  //   images.bg,
  //   images.Monkey,
  //   images.building,
  //   images.Man,
  //   images.monk,
  // ];

  // const createdArray = [images.old1, images.bg, images.Monkey, images.building];

  // const likeArray = [
  //   images.monk,
  //   images.old1,
  //   images.bg,
  //   images.Monkey,
  //   images.building,
  // ];

  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
    },
    {
      background: images.creatorbackground1,
      user: images.user2,
    },
    {
      background: images.creatorbackground1,
      user: images.user3,
    },
    {
      background: images.creatorbackground1,
      user: images.user4,
    },
    {
      background: images.creatorbackground1,
      user: images.user5,
    },
    {
      background: images.creatorbackground1,
      user: images.user6,
    },
  ];

  const followingArray = [
    {
      background: images.creatorbackground1,
      user: images.user3,
      seller: "ir74sf8eg7e8e9mioo2j8hf2j7g4j",
    },
    {
      background: images.creatorbackground1,
      user: images.user4,
      seller: "ir74sf8eg7e8e9mioo2j8hf2j7g4j",
    },
    {
      background: images.creatorbackground1,
      user: images.user5,
      seller: "ir74sf8eg7e8e9mioo2j8hf2j7g4j",
    },
    {
      background: images.creatorbackground1,
      user: images.user6,
      seller: "ir74sf8eg7e8e9mioo2j8hf2j7g4j",
    },
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: "ir74sf8eg7e8e9mioo2j8hf2j7g4j",
    },
  ];
  return (
    <div className={Style.AuthorNFTCardBox}>
      {collectiables && <NFTCardTwo NFTData={nfts} />}
      {created && <NFTCardTwo NFTData={myNFTs} />}
      {/* {like && <NFTCardTwo NFTData={nfts} />} */}
      {/* {follower && (
        <div className={Style.AuthorNFTCardBox_box}>
          {followerArray.map((el, i) => (
            <FollowerTabCard i={i} el={el.image} />
          ))}
        </div>
      )}
      {following && (
        <div className={Style.AuthorNFTCardBox_box}>
          {followingArray.map((el, i) => (
            <FollowerTabCard i={i} el={el.image} />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default AuthorNFTCardBox;
