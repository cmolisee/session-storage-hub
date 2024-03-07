import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Popup from './views/popup';
import Options from './views/options';
import { ToastContainer, Zoom } from 'react-toastify';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './providers/useTheme';
import { Themes } from './types/types';

// there is an issue with react router causing error when trying to switch data keys...
// there is also an issue with shit not updating until the second click... fuuuuck.
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
			transition={Zoom}
			hideProgressBar
			theme="colored"
			draggable
			limit={3}
		/>
	</React.StrictMode>
);
