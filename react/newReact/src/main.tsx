import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './store/store.ts'
import { AntProvider } from './theme/AntProvider.tsx'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AntProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AntProvider>
    </BrowserRouter>
  </StrictMode>,
)
