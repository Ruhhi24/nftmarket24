import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";

// INTERNAL IMPORT
import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  transferFundsABI,
  transferFundsAddress,
} from "./constants";

//---- FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

// CONNECTING WITH SMART CONTRACT
const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log(
      "Something went wrong while connecting with the  smart contract" + error
    );
  }
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTs";

  //usestate
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const router = useRouter();

  //CHECK IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install  Metamask!");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        setError("No Account Found!");
        setOpenError(true);
        console.log(
          "Something wen wrong while checkIfWalletConnected: " + error
        );
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const getBalance = await provider.getBalance(accounts[0]);
      const bal = ethers.utils.formatEther(getBalance);
      setAccountBalance(bal);
      // console.log(currentAccount);
    } catch (error) {
      setError("No Account Found!");
      setOpenError(true);
      console.log(`Something went wrong while connecting to wallet:  ${error}`);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  // CONNECT WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Please install metamask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      // window.location.reload();
      connectingWithSmartContract();
    } catch (error) {
      setError("Error While connecting to wallet");
      setOpenError(true);
    }
  };

  // UPLOAD TO IFPS FUNCTION
  const uploadToPinata = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `b8e1df6b16472bd2e976`,
            pinata_secret_api_key: `9e509dfe721d0dcc52e06947441c0123e504397dab014283bdfdc5951744c34a`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        return ImgHash;
      } catch (error) {
        setError("Unable to upload image to Pinata");
        setOpenError(true);
      }
    }
  };

  //CREATENFT FUNCTION
  const createNFT = async (name, price, image, description, router) => {
    if (!name || !description || !price || !image)
      return setError("Data Is Missing"), setOpenError(true);

    const data = JSON.stringify({
      name,
      description,
      image,
    });

    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `b8e1df6b16472bd2e976`,
          pinata_secret_api_key: `9e509dfe721d0dcc52e06947441c0123e504397dab014283bdfdc5951744c34a`,
          "Content-Type": "application/json",
        },
      });
      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log(url);
      await createSale(url, price);
      router.push("/searchPage");
    } catch (error) {
      setError("Error while creating  NFT");
      setOpenError(true);
    }
  };

  //CREATESALE FUNCTION
  const createSale = async (url, formInputPrice, isReslleing, id) => {
    try {
      const price = ethers.utils.parseUnits(formInputPrice, "ether");
      const contract = await connectingWithSmartContract();

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReslleing
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
          });

      await transaction.wait();
    } catch (error) {
      setError("Error While creating Sale");
      setOpenError(true);
    }
  };

  //FETCHNFTS FUNCTION
  const fetchNFTs = async () => {
    try {
      if (currentAccount) {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://polygon-mumbai.g.alchemy.com/v2/g6mv1ccIQR7sdDfOZg6x7RgtSF8FYdLM"
        );

        console.log(provider);
        const contract = fetchContract(provider);

        const data = await contract.fetchMarketItems();
        //   console.log(data)

        const items = await Promise.all(
          data.map(
            async ({ tokenId, seller, owner, price: unformattedPrice }) => {
              const tokenURI = await contract.tokenURI(tokenId);

              const {
                data: { image, name, description },
              } = await axios.get(tokenURI);
              const price = ethers.utils.formatUnits(
                unformattedPrice.toString(),
                "ether"
              );

              return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
              };
            }
          )
        );
        return items;
      }
    } catch (error) {
      setError("Error while fetching NFTS");
      setOpenError(true);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      fetchNFTs();
    }
  }, []);

  //--FETCHING MY NFT OR LISTED NFTs
  const fetchMyNFTsOrListedNFTS = async (type) => {
    try {
      if (currentAccount) {
        const contract = await connectingWithSmartContract();

        const data =
          type == "fetchItemsListed"
            ? await contract.fetchItemsListed()
            : await contract.fetchMyNFTs();

        const items = await Promise.all(
          data.map(
            async ({ tokenId, seller, owner, price: unformattedPrice }) => {
              const tokenURI = await contract.tokenURI(tokenId);
              const {
                data: { image, name, description },
              } = await axios.get(tokenURI);
              const price = ethers.utils.formatUnits(
                unformattedPrice.toString(),
                "ether"
              );

              return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
              };
            }
          )
        );
        return items;
      }
    } catch (error) {
      setError("Error while fetching listed NFTs");
      setOpenError(true);
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTS();
  }, []);

  //---BUY NFTs FUNCTION
  const buyNFT = async (nfts) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nfts.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nfts.tokenId, {
        value: price,
      });
      await transaction.wait();
      router.push("/author");
    } catch (error) {
      setError("Something went wrong while buying NFT!");
      setOpenError(true);
      console.error("Something went wrong while buying NFT: " + error);
    }
  };

  //----TRANSFER FUNDS

  const fetchTransferFundsContract = (signerOrProvider) =>
    new ethers.Contract(
      transferFundsAddress,
      transferFundsABI,
      signerOrProvider
    );

  const connectToTransferFunds = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchTransferFundsContract(signer);
      return contract;
    } catch (error) {
      console.log(error);
    }
  };
  //---TRANSFER FUNDS
  const [transactionCount, setTransactionCount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const transferEther = async (address, ether, message) => {
    try {
      if (currentAccount) {
        const contract = await connectToTransferFunds();
        console.log(address, ether, message);

        const unFormatedPrice = ethers.utils.parseEther(ether);
        // // //FIRST METHOD TO TRANSFER FUND
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: address,
              gas: "0x5208",
              value: unFormatedPrice._hex,
            },
          ],
        });

        const transaction = await contract.addDataToBlockchain(
          address,
          unFormatedPrice,
          message
        );

        console.log(transaction);

        setLoading(true);
        transaction.wait();
        setLoading(false);

        const transactionCount = await contract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //FETCH ALL TRANSACTION
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const contract = await connectToTransferFunds();

        const avaliableTransaction = await contract.getAllTransactions();

        const readTransaction = avaliableTransaction.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        }));

        setTransactions(readTransaction);
        // console.log(transactions);
      } else {
        console.log("On Ethereum" + error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const checkContract = async () => {
  //   const contract = await connectingWithSmartContract();
  //   console.log(contract);
  // };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        // checkContract,
        checkIfWalletConnected,
        connectWallet,
        uploadToPinata,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTS,
        buyNFT,
        createSale,
        currentAccount,
        titleData,
        setOpenError,
        openError,
        error,
        transferEther,
        getAllTransactions,
        loading,
        accountBalance,
        transactionCount,
        transactions,
      }}>
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
