import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthProvider';
import './styles/global.css';
import './styles/print.css';
import { HashRouter } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
);
