import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import DollarProvider from '../sections/sales/Manager'
import SalesSectionManager from '../sections/sales/SalesSectionManager'
import OweSectionManager from '../sections/owes/OweSectionManager'
import ToolBar from './ToolBar'
import OweProvider from '../sections/owes/OweProvider'
import AnalyticSection from './AnalyticSection'
import GazaCalcSection from '../sections/gazaCalc/GazaCalcSection'
import GazaCalcProvider from '../sections/gazaCalc/GazaCalcProvider'
import AnalyticManager from './AnalyticsManager'

export const SectionSliderContext = createContext()

export const SectionDisplayer = () => {
  const { currentSection, APP_SECTIONS } = useContext(SectionSliderContext)
  return (
    <main
      id="content"
      className="bg-slate-50 grid place-items-center h-full relative overflow-x-auto overflow-y-hidden"
    >
      <ToolBar />

      <div className={'w-full h-full grid place-items-center'}>
        {currentSection === APP_SECTIONS.SALES_SECTION ? (
          <DollarProvider>
            <SalesSectionManager />
          </DollarProvider>
        ) : currentSection === APP_SECTIONS.OWE_SECTION ? (
          <OweProvider>
            <OweSectionManager />
          </OweProvider>
        ) : currentSection === APP_SECTIONS.ANALYTICS_SECTION ? (
          <AnalyticManager>
            <AnalyticSection />
          </AnalyticManager>
        ) : currentSection === APP_SECTIONS.GAZA_CALC_SECTION ? (
          <GazaCalcProvider>
            <GazaCalcSection />
          </GazaCalcProvider>
        ) : null}
      </div>
    </main>
  )
}

const SectionSliderProvider = ({ children }) => {
  const APP_SECTIONS = Object.freeze({
    SALES_SECTION: 'compras',
    OWE_SECTION: 'deudas',
    ANALYTICS_SECTION: 'analysis',
    GAZA_CALC_SECTION: 'gaza calc'
  })

  const [currentSection, setCurrentSection] = useState(
    APP_SECTIONS.SALES_SECTION
  )

  const [todaySales, setTodaySales] = useState(0)
  const [updateNavInfo, setUpdateNavInfo] = useState(false)

  return (
    <SectionSliderContext.Provider
      value={{
        APP_SECTIONS,
        currentSection,
        setCurrentSection,
        todaySales,
        setTodaySales,
        updateNavInfo,
        setUpdateNavInfo
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
