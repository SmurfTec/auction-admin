// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from 'contexts/AuthContext';
import { ToastContainer } from 'react-toastify';

// ----------------------------------------------------------------------

// * Styles Sheets for different packages ----
import 'react-toastify/dist/ReactToastify.css';
import { AuctionsProvider } from 'contexts/AuctionsContext';
import { UsersProvider } from 'contexts/UsersContext';
import { CategoriesProvider } from 'contexts/CategoriesContext';

// * ---------------  //

ReactDOM.render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <AuctionsProvider>
          <UsersProvider>
            <CategoriesProvider>
              <App />
            </CategoriesProvider>
          </UsersProvider>
        </AuctionsProvider>
        <ToastContainer autoClose={4000} />
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
