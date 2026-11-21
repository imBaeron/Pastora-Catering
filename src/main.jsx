import { createRoot } from 'react-dom/client'
import App from './App'
import { CatalogProvider } from './CatalogContext'
import './styles/index.css'

createRoot(document.getElementById('root')).render(<CatalogProvider><App /></CatalogProvider>)
