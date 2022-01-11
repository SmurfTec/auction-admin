import React, { useContext, useEffect, useState } from 'react';
import { useArray, useToggleInput } from 'hooks';
import { makeReq, handleCatch } from 'utils/makeReq';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const CategoriesContext = React.createContext();

export const CategoriesProvider = ({ children }) => {
  const { isLoggedin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [
    categories,
    setCategories,
    pushCategory,
    filterCategories,
    updateCategory,
    removeCategory,
    clearCategories
  ] = useArray([], '_id');
  const [loading, toggleLoading] = useToggleInput(true);

  const fetchCategories = async () => {
    try {
      const resData = await makeReq('/categories');
      // console.log(`resData`, resData);
      setCategories(resData.categories);
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
    fetchCategories();
  }, [isLoggedin]);

  // * CRUD Operations
  const getUserById = (id) => categories.find((el) => el._id === id);

  const createCategory = async (payload) => {
    try {
      const resData = await makeReq(`/categories/`, { body: { name: payload } }, 'POST');
      toast.success('Category Created Successfully');
      pushCategory(resData.category);
    } catch (err) {
      handleCatch(err);
    } finally {
    }
  };
  const editCategory = async (id, payload) => {
    try {
      const resData = await makeReq(`/categories/${id}`, { body: { name: payload } }, 'PATCH');
      toast.success('Category Updated Successfully');
      updateCategory(id, resData.category);
    } catch (err) {
      handleCatch(err);
    } finally {
    }
  };
  const deleteCategory = async (id) => {
    try {
      await makeReq(`/categories/${id}`, {}, 'DELETE');
      toast.success('Category Deleted Successfully');
      removeCategory(id);
    } catch (err) {
      handleCatch(err);
    } finally {
    }
  };

  return (
    <CategoriesContext.Provider
      displayName="Categories Context"
      value={{
        categories,
        loading,
        getUserById,
        deleteCategory,
        createCategory,
        editCategory
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
