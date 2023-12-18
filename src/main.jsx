import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './components/Navbar.jsx'
import ProductList from './components/ProductList.jsx'
import Measure from './components/Measure.jsx'
import './index.css'
import './css/colors.module.css'
import './css/tokens.css'
import './css/theme.css'
import './css/typography.module.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navbar />
    <main id="content">
      <ProductList />
      <Measure/>
    </main>
  </React.StrictMode>
)
