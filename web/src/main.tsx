import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { TemaProvider } from './context/temaProvider'
import { AvisosProvider } from './context/avisosProvider'
import ErrorBoundary from './components/common/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <TemaProvider>
      <AvisosProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AvisosProvider>
    </TemaProvider>
  </BrowserRouter>,
)
