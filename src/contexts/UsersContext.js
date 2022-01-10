import React, { useContext, useEffect, useState } from 'react';
import { useArray, useToggleInput } from 'hooks';
import { makeReq, handleCatch } from 'utils/makeReq';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const UsersContext = React.createContext();

export const UsersProvider = ({ children }) => {
  const { isLoggedin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [
    users,
    setUsers,
    pushUser
    // filterUsers,
    // updateUser,
    // removeUser,
    // clearUsers,
  ] = useArray([], '_id');
  const [loading, toggleLoading] = useToggleInput(true);

  const fetchUsers = async () => {
    try {
      const resData = await makeReq('/users');
      // console.log(`resData`, resData);
      setUsers(resData.users);
    } catch (err) {
      // console.log(`err`, err)
    } finally {
      toggleLoading();
    }
  };

  useEffect(() => {
    console.log(`isLoggedin`, isLoggedin);
    if (!isLoggedin) return;

    // * only fetch if user is logged In
    fetchUsers();
  }, [isLoggedin]);

  // * CRUD Operations
  const getUserById = (id) => users.find((el) => el._id === id);

  return (
    <UsersContext.Provider
      displayName="Users Context"
      value={{
        users,
        loading,
        getUserById
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
