import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import CoinContextProvider from './context/CoinContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import "react-responsive-carousel/lib/styles/carousel.min.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CoinContextProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CoinContextProvider>
    </BrowserRouter>
  </StrictMode>,
)