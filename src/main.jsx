import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import './index.css'
import App from './App.jsx'

// Global interceptor: automatically rewrites localhost in production
axios.interceptors.request.use((config) => {
  if (import.meta.env.PROD && config.url && config.url.startsWith('http://localhost:5000')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    config.url = config.url.replace('http://localhost:5000', apiBase);
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)


