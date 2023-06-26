import React from 'react';
import { createRoot } from 'react-dom';
import './index.css';
import Button from './components/Button/Button';

createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<div>
            <Button />
        </div>
	</React.StrictMode>
);
