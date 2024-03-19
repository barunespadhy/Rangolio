import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import "./assets/argon-design-system-react/vendor/nucleo/css/nucleo.css";
import "./assets/argon-design-system-react/vendor/font-awesome/css/font-awesome.min.css";
import "./assets/argon-design-system-react/scss/argon-design-system-react.scss?v1.1.0";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();