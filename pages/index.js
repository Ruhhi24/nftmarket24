import React, { useState, useEffect, useContext } from "react";

// INTERNAL IMPORT
import Style from "../styles/index.module.css";
import {
  HeroSection,
  Service,
  Title,
  Filter,
  FollowerTab,
  NFTCard,
  Loader,
} from "../components/componentsindex";

import { getTopCreators } from "../TopCreators/TopCreators";

//IMPORTING CONTRACT DATA
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Home = () => {
  const { fetchNFTs, checkIfWalletConnected, currentAccount } = useContext(
    NFTMarketplaceContext
  );

  useEffect(() => {
    checkIfWalletConnected;
  }, []);

  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    if (currentAccount) {
      fetchNFTs().then((items) => {
        // console.log(nfts);
        setNfts(items.reverse());
        setNftsCopy(items);
      });
    }
  }, []);

  // CREATOR LIST
  const creators = getTopCreators(nfts);
  console.log(creators);

  // const Home = () => {
  //   const { checkContract } = useContext(NFTMarketplaceContext);

  //   useEffect(() => {
  //     checkContract();
  //   }, []);

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />

      {creators.length == 0 ? (
        <Loader />
      ) : (
        <FollowerTab TopCreator={creators} />
      )}

      <Title
        heading="Featured NFTs"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <Filter />

      {nfts.length == 0 ? <Loader /> : <NFTCard NFTData={nfts} />}
    </div>
  );
};

export default Home;
