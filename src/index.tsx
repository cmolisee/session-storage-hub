import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './views/popup';
import { ToastContainer, Flip } from 'react-toastify';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import 'react-toastify/scss/main.scss';
import './_global.scss';
import Options from './views/options';
import { ThemeProvider, Themes } from './providers/useTheme';

const router = createHashRouter([
	{ path: '/', element: <Popup /> },
	{ path: '/options', element: <Options /> },
]);

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
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
