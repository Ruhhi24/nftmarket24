import React from "react";

//INTERNAL IMPORT
import { NFTDescription, NFTDetailsImg, NFTTabs } from "./NFTDetailsIndex";
import Style from "./NFTDetailsPage.module.css";

const NFTDetailsPage = ({ nfts }) => {
  return (
    <div className={Style.NFTDetailsPage}>
      <div className={Style.NFTDetailsPage_box}>
        <NFTDetailsImg nfts={nfts} />
        <NFTDescription nfts={nfts} />
      </div>
    </div>
  );
};

export default NFTDetailsPage;
