import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import reportWebVitals from './reportWebVitals';

// Base URL for all API calls.
// - In production (Vercel), defaults to the deployed Render backend.
// - For local dev, set REACT_APP_API_URL=http://localhost:8080 in client/.env
axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "https://backend-wm93.onrender.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
