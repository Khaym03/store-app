import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './components/Navbar.jsx'
import SectionSliderProvider from './components/SectionSliderProvider.jsx'
import { SectionDisplayer } from './components/SectionSliderProvider.jsx'
import GlobalProvider from './components/GlobalProvider.jsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalProvider>
      <SectionSliderProvider>
        <Navbar />
        <SectionDisplayer />
      </SectionSliderProvider>
    </GlobalProvider>
  </React.StrictMode>
)
