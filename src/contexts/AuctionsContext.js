import React, { useContext, useEffect, useState } from 'react';
import { useArray, useToggleInput } from 'hooks';
import { makeReq, handleCatch } from 'utils/makeReq';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AuctionsContext = React.createContext();

export const AuctionsProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [
    auctions,
    setAuctions,
    pushAuction
    // filterAuctions,
    // updateAuction,
    // removeAuction,
    // clearAuctions,
  ] = useArray([], '_id');
  const [loading, toggleLoading] = useToggleInput(true);

  const fetchAuctions = async () => {
    try {
      const resData = await makeReq('/auctions');
      // console.log(`resData`, resData);
      setAuctions(resData.auctions);
    } catch (err) {
      // console.log(`err`, err)
    } finally {
      toggleLoading();
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    // * only fetch if user is logged In
    fetchAuctions();
  }, [isLoggedIn]);

  // * CRUD Operations
  const getAuctionById = (id) => auctions.find((el) => el._id === id);

  return (
    <AuctionsContext.Provider
      displayName="Auctions Context"
      value={{
        auctions,
        loading,
        getAuctionById
      }}
    >
      {children}
    </AuctionsContext.Provider>
  );
};
