import React, { useEffect, useState, useContext } from "react";

//INTRNAL IMPORT
import Style from "../styles/searchPage.module.css";
import { Slider, Loader } from "../components/componentsindex";
import { SearchBar } from "../SearchPage/searchBarIndex";
import { Filter } from "../components/componentsindex";

import { NFTCardTwo } from "../collectionPage/collectionIndex";
import images from "../img";

// SMART CONTRACT IMPORT
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const searchPage = () => {
  const { fetchNFTs, setError, currentAccount } = useContext(
    NFTMarketplaceContext
  ); //get the data and functions of context
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    try {
      if (currentAccount) {
        fetchNFTs().then((items) => {
          setNfts(items.reverse());
          setNftsCopy(items);
          // console.log(nfts);
        });
      }
    } catch (error) {
      setError("Please reload the browser", error);
    }
  }, []);

  const onHandleSearch = (value) => {
    const filteredNFTS = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredNFTS.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNFTS);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  // const collectionArray = [
  //   images.Man,
  //   images.monk,
  //   images.old1,
  //   images.bg,
  //   images.Monkey,
  //   images.building,
  //   images.Man,
  //   images.bg,
  // ];
  return (
    <div className={Style.searchPage}>
      <SearchBar
        onHandleSearch={onHandleSearch}
        onClearSearch={onClearSearch}
      />
      <Filter />
      {nfts.length == 0 ? <Loader /> : <NFTCardTwo NFTData={nfts} />}
    </div>
  );
};

export default searchPage;
