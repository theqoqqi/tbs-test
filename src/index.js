import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Locale from './cls/localization/Locale.js';
import * as localeJsons from './data/json/localization/ru';

let locale = new Locale(Object.values(localeJsons));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // Если включить StrictMode, функции жизненного цикла компонентов вызываются дважды
    // <React.StrictMode>
        <App locale={locale} />
    // </React.StrictMode>
);