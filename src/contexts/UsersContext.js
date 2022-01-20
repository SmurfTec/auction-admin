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
    pushUser,
    filterUsers,
    updateUser,
    removeUser
    // clearUsers,
  ] = useArray([], '_id');
  const [loading, toggleLoading] = useToggleInput(true);

  const [loadingContacts, toggleLoadingContacts] = useToggleInput(true);
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const resData = await makeReq('/contacts');
      // console.log(`resData`, resData);
      setContacts(resData.contacts);
    } catch (err) {
      // console.log(`err`, err)
    } finally {
      toggleLoadingContacts();
    }
  };
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
    fetchContacts();
  }, [isLoggedin]);

  // * CRUD Operations
  const getUserById = (id) => users.find((el) => el._id === id);

  const deleteUser = async (id) => {
    await makeReq(`/users/${id}`);

    toast.success('User Deleted Successfully!', {}, 'DELETE');
    removeUser(id);
  };

  return (
    <UsersContext.Provider
      displayName="Users Context"
      value={{
        users,
        loading,
        getUserById,
        loadingContacts,
        contacts,
        deleteUser
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
