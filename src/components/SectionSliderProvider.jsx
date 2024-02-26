import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import DollarProvider from './DollarProvider'
import SalesSectionManager from './SalesSectionManager'
import OweSectionManager from './OweSectionManager'
import ToolBar from './ToolBar'
import OweProvider from './OweProvider'
import AnalyticSection from './AnalyticSection'
import { animated, useTransition } from '@react-spring/web'
import GazaCalcSection from './GazaCalcSection'
import  GazaCalcProvider  from './GazaCalcProvider'

export const SectionSliderContext = createContext()

export const SectionDisplayer = () => {
  const { currentSection, APP_SECTIONS } = useContext(SectionSliderContext)

  const transitions = useTransition(currentSection, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })
  return (
    <main
      id="content"
      className="grid place-items-center h-full relative overflow-x-auto overflow-y-hidden"
    >
      <ToolBar />
      {transitions((style, section) => (
        <animated.div style={style} className={'absolute'}>
          {section === APP_SECTIONS.SALES_SECTION ? (
            <DollarProvider>
              <SalesSectionManager />
            </DollarProvider>
          ) : section === APP_SECTIONS.OWE_SECTION ? (
            <OweProvider>
              <OweSectionManager />
            </OweProvider>
          ) : section === APP_SECTIONS.ANALYTICS_SECTION ? (
            <AnalyticSection />
          ) : section === APP_SECTIONS.GAZA_CALC_SECTION ? (
            <GazaCalcProvider>
              <GazaCalcSection />
            </GazaCalcProvider>
          ) : null}
        </animated.div>
      ))}
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
