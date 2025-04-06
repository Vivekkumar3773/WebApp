import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Ensure this is imported
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root') // Ensure this matches the id in index.html
);
