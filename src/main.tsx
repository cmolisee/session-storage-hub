import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Popup from './views/popup';
import Options from './views/options';
import { ToastContainer, Zoom } from 'react-toastify';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './providers/useTheme';
import { StorageDataProvider } from './providers/useStorageData'
import { Themes } from './types/types';

const router = createHashRouter([
	{ path: '/', element: <Popup /> },
	{ path: '/options', element: <Options /> },
]);

ReactDOM.createRoot(document.getElementById('sessionStorageHub')!).render(
	<React.StrictMode>
		<ThemeProvider defaultThemeName={Themes.a11yLight}>
			<StorageDataProvider>
				<RouterProvider router={router} />
			</StorageDataProvider>
		</ThemeProvider>
		<ToastContainer
			position="bottom-center"
			transition={Zoom}
			hideProgressBar
			theme="colored"
			draggable
			limit={3}
		/>
	</React.StrictMode>
);
