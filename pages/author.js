import React, { useState, useEffect, useContext } from "react";

//INTERNAL IMPORT
import Style from "../styles/author.module.css";
import { NFTCardTwo } from "../collectionPage/collectionIndex";
import { Loader } from "../components/componentsindex";
import images from "../img";
import {
  AuthorProfileCard,
  AuthorTaps,
  AuthorNFTCardBox,
} from "../authorPage/componentIndex";

// IMPORT SMART CONTRACT DATA
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const author = () => {
  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: "ir74sf8eg7e8e9mioo2j8hf2j7g4j",
    },
    {
      background: images.creatorbackground1,
      user: images.user2,
      seller: "ir74sf8eg7e8e9mioo2j8hf2j7g4j",
    },
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
  ];

  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [like, setLike] = useState(false);
  const [follower, setFollower] = useState(false);
  const [following, setFollowing] = useState(false);

  // IMPORT SMART CONTRACT DATA
  const { fetchMyNFTsOrListedNFTS, currentAccount } = useContext(
    NFTMarketplaceContext
  );

  const [nfts, setNfts] = useState([]);
  const [myNFTs, setmyNFTs] = useState([]);

  useEffect(() => {
    fetchMyNFTsOrListedNFTS("fetchItemsListed").then((items) => {
      setNfts(items);
    });
  }, []);

  useEffect(() => {
    fetchMyNFTsOrListedNFTS("fetchMyNFTs").then((items) => {
      setmyNFTs(items);
    });
  }, []);
  return (
    <div className={Style.author}>
      <AuthorProfileCard currentAccount={currentAccount} />
      <AuthorTaps
        setCollectiables={setCollectiables}
        setCreated={setCreated}
        setLike={setLike}
        setFollower={setFollower}
        setFollowing={setFollowing}
      />

      <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        like={like}
        follower={follower}
        following={following}
        nfts={nfts}
        myNFTs={myNFTs}
      />
    </div>
  );
};

export default author;
