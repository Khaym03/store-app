import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './components/Navbar.jsx'
import SectionSliderProvider from './components/SectionSliderProvider.jsx'
import { SectionDisplayer } from './components/SectionSliderProvider.jsx'

import './index.css'
import './css/colors.module.css'
import './css/tokens.css'
import './css/theme.css'
import './css/typography.module.css'

const ignore = new Map()
ignore.set('cloro','cloro')
ignore.set('desengrasante', 'desengrasante')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SectionSliderProvider>
      <Navbar />
      <SectionDisplayer />
    </SectionSliderProvider>
  </React.StrictMode>
)
