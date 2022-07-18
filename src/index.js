import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // Если включить StrictMode, функции жизненного цикла компонентов вызываются дважды
    // <React.StrictMode>
        <App />
    // </React.StrictMode>
);