import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './views/popup';

const rootEle = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootEle);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
