import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Popup from './views/popup';
import Options from './views/options';
import { ToastContainer, Flip } from 'react-toastify';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './providers/useTheme';
import { Themes } from './types/types';

const router = createHashRouter([
	{ path: '/', element: <Popup /> },
	{ path: '/options', element: <Options /> },
]);

ReactDOM.createRoot(document.getElementById('sessionStorageHub')!).render(
	<React.StrictMode>
		<ThemeProvider defaultThemeName={Themes.a11yLight}>
			<RouterProvider router={router} />
		</ThemeProvider>
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