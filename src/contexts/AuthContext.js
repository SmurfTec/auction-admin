import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeReq, handleCatch } from 'utils/makeReq';

export const LOCALSTORAGE_TOKEN_KEY = 'auction-token';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  // let history = useHistory();
  let tokenLocal;
  const navigate = useNavigate();

  try {
    tokenLocal = window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
  } catch (err) {
    tokenLocal = null;
  }

  const [token, setToken] = useState(tokenLocal);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe();
  }, []);

  const isLoggedin = user ? true : false;

  const getMe = async () => {
    try {
      const res = await makeReq(`/users/me`, {}, 'GET');
      // console.log(`res`, res);

      setUser(res.user);
    } catch (err) {
      setToken(null);
      localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
      localStorage.removeItem('user');

      // if (history.location !== '/') history.push('/');
    }
  };

  const updateMe = async (newProfile, setState) => {
    try {
      const res = await makeReq(`/users/me`, { body: { ...newProfile } }, 'PATCH');
      // console.log(`res`, res);

      setUser(res.user);
      toast.success('Profile Updated Successfully !');
    } catch (err) {
      handleCatch(err);
    }
  };

  const signInUser = (tk, us) => {
    // console.log(`tk`, tk);
    // console.log(`us`, us);

    window.localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, tk);

    setTimeout(() => {
      setToken(tk);
      setUser(us);
    }, 1000);
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
  };

  // Update Staffer
  const changeMyPassword = async (updatedPassword) => {
    try {
      const resData = await makeReq(
        `/users/updatepassword/${user._id}`,
        { body: { ...updatedPassword } },
        'PATCH'
      );
      toast.success('Password Updated Successfully !');
      setUser(resData.user);
    } catch (err) {
      handleCatch(err);
    }
  };

  const createGig = async (gig) => {
    try {
      const resData = await makeReq(`/gigs`, { body: gig }, 'POST');
      // console.log(`resData`, resData);

      setUser((st) => ({ ...st, gigs: [...st.gigs, resData.gig] }));
      toast.success('Service created Successfully!');
      navigate('/profile');
    } catch (err) {
      handleCatch(err);
    }
  };

  //   const updateGig = async (id, gig) => {
  //     try {
  //       const resData = await makeReq(`/gigs/${id}`, { body: gig }, 'PATCH');
  //       // console.log(`resData`, resData);

  //       setUser((st) => ({
  //         ...st,
  //         gigs: st.gigs.map((el) => (el._id === id ? resData.gig : el)),
  //       }));
  //       toast.success('Service Updated Successfully!');
  //     } catch (err) {
  //       handleCatch(err);
  //     }
  //   };

  //   const deleteGig = async (id) => {
  //     try {
  //       await makeReq(`/gigs/${id}`, {}, 'DELETE');
  //       // console.log(`resData`, resData);

  //       setUser((st) => ({
  //         ...st,
  //         gigs: st.gigs.filter((el) => el._id !== id),
  //       }));
  //       toast.success('Service Deleted Successfully!');
  //     } catch (err) {
  //       handleCatch(err);
  //     }
  //   };

  return (
    <AuthContext.Provider
      displayName="Auth Context"
      value={{
        token,
        setToken,
        logoutUser,
        user,
        setUser,
        signInUser,
        updateMe,
        changeMyPassword,
        isLoggedin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
