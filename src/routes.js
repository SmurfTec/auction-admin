// ----------------------------------------------------------------------
import { Navigate, Route, Routes, useRoutes } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import React, { useContext } from 'react';
import Loader from 'components/common/Loading';
import Logout from 'pages/Logout';
// layouts
const LazyDashboardLayout = React.lazy(() => import('./layouts/dashboard'));
const LazyLogoOnlyLayout = React.lazy(() => import('./layouts/LogoOnlyLayout'));
//
const LazyLogin = React.lazy(() => import('./pages/Login'));
const LazyRegister = React.lazy(() => import('./pages/Register'));
const LazyDashboardApp = React.lazy(() => import('./pages/DashboardApp'));
const LazyProducts = React.lazy(() => import('./pages/Products'));
const LazyBlog = React.lazy(() => import('./pages/Blog'));
const LazyUser = React.lazy(() => import('./pages/User'));
const LazyNotFound = React.lazy(() => import('./pages/Page404'));

export default function Router() {
  const { token, isLoggedin } = useContext(AuthContext);

  return (
    <>
      {token ? (
        isLoggedin ? (
          <Routes>
            <Route
              path="/"
              element={
                <React.Suspense fallback={<Loader />}>
                  <LazyDashboardLayout />
                </React.Suspense>
              }
            >
              <Route
                path="/"
                element={
                  <React.Suspense fallback={<Loader />}>
                    <LazyDashboardApp />
                  </React.Suspense>
                }
              />
              <Route
                path="user"
                element={
                  <React.Suspense fallback={<Loader />}>
                    <LazyUser />
                  </React.Suspense>
                }
              />
              <Route
                path="products"
                element={
                  <React.Suspense fallback={<Loader />}>
                    <LazyProducts />
                  </React.Suspense>
                }
              />
              <Route
                path="blog"
                element={
                  <React.Suspense fallback={<Loader />}>
                    <LazyBlog />
                  </React.Suspense>
                }
              />
            </Route>
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Loader />
        )
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <React.Suspense fallback={<Loader />}>
                <LazyLogoOnlyLayout />
              </React.Suspense>
            }
          >
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="login"
              element={
                <React.Suspense fallback={<Loader />}>
                  <LazyLogin />
                </React.Suspense>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />

          {/* <Route
            path="register"
            element={
              <React.Suspense fallback={<Loader />}>
                <LazyRegister />
              </React.Suspense>
            }
          /> */}
        </Routes>
      )}
    </>
  );
}
