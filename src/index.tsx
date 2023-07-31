import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './views/popup';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/scss/main.scss';

const rootEle = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootEle);
root.render(
	<React.StrictMode>
		<Popup />
		<ToastContainer
			position="bottom-center"
			transition={Flip}
			autoClose={500}
			hideProgressBar
			limit={1}
			newestOnTop
			closeOnClick
			rtl={false}
			pauseOnFocusLoss={false}
			draggable={false}
			pauseOnHover
			theme="colored"
		/>
	</React.StrictMode>
);
