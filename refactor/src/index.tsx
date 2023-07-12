import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './views/popup';
import { ToastContainer } from 'react-toastify';

const rootEle = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootEle);
root.render(
  <React.StrictMode>
    <Popup />
    <ToastContainer
      position="bottom-center"
      autoClose={2000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover
      theme="colored" />
  </React.StrictMode>
);
