import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './components/Navbar.jsx'
import DollarProvider from './components/DollarProvider.jsx'
import SalesSectionManager from './components/SalesSectionManager.jsx'
import ProductList from './components/ProductList.jsx'
import Measure from './components/Measure.jsx'
import Order from './components/Order.jsx'
import './index.css'
import './css/colors.module.css'
import './css/tokens.css'
import './css/theme.css'
import './css/typography.module.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navbar />
    <DollarProvider>
      <SalesSectionManager>
        <ProductList />
        <Measure />
        <Order />
      </SalesSectionManager>
    </DollarProvider>
  </React.StrictMode>
)
