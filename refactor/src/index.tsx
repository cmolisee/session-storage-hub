import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './views/popup';

const rootEle = document.getElementById('root') as HTMLElement;
rootEle.style.margin = '0.125rem';
const root = ReactDOM.createRoot(rootEle);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
