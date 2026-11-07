import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { TemaProvider } from './context/temaProvider'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <TemaProvider>
      <App />
    </TemaProvider>
  </BrowserRouter>,
)
