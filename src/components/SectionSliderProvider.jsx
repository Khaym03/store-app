import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import DollarProvider from './DollarProvider'
import SalesSectionManager from './SalesSectionManager'
import OweSectionManager from './OweSectionManager'
import ToolBar from './ToolBar'
import OweProvider from './OweProvider'
import AnalyticSection from './AnalyticSection'
import OptimalPurchase from '../hooks/OptimalPurchase'

export const SectionSliderContext = createContext()

export const SectionDisplayer = () => {
  const { currentSection, APP_SECTIONS } = useContext(SectionSliderContext)
  // const ignore = new Map()
  // ignore.set('cloro', 'cloro')
  // ignore.set('desengrasante', 'desengrasante')
  // const {optimalPurchase} = OptimalPurchase(1346, ignore)
  
  // console.log(optimalPurchase)
  return (
    <main id="content" className="grid place-items-center h-full relative overflow-x-auto overflow-y-hidden">
      <ToolBar />
      {currentSection === APP_SECTIONS.SALES_SECTION ? (
        <DollarProvider>
          <SalesSectionManager />
        </DollarProvider>
      ) : currentSection === APP_SECTIONS.OWE_SECTION ? (
        <OweProvider>
          <OweSectionManager />
        </OweProvider>
      ) : currentSection === APP_SECTIONS.ANALYTICS_SECTION ? (
        <AnalyticSection />
      ) : null}
    </main>
  )
}

const SectionSliderProvider = ({ children }) => {
  const APP_SECTIONS = Object.freeze({
    SALES_SECTION: 'compras',
    OWE_SECTION: 'deudas',
    ANALYTICS_SECTION: 'analysis'
  })

  const [currentSection, setCurrentSection] = useState(
    APP_SECTIONS.SALES_SECTION
  )

  const [todaySales, setTodaySales] = useState(0)
  const [saveButtonWasClicked, setSaveButtonWasClicked] = useState(false)

  return (
    <SectionSliderContext.Provider
      value={{
        APP_SECTIONS,
        currentSection,
        setCurrentSection,
        todaySales,
        setTodaySales,
        saveButtonWasClicked,
        setSaveButtonWasClicked
      }}
    >
      {children}
    </SectionSliderContext.Provider>
  )
}

SectionSliderProvider.propTypes = {
  children: PropTypes.node
}

export default SectionSliderProvider
