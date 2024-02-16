import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import DollarProvider from './DollarProvider'
import SalesSectionManager from './SalesSectionManager'
import OweSectionManager from './OweSectionManager'
import ToolBar from './ToolBar'

export const SectionSliderContext = createContext()

export const SectionDisplayer = () => {
  const { currentSection, APP_SECTIONS } = useContext(SectionSliderContext)

  return (
    <main id="content" className="grid-center">
      <ToolBar/>
      {currentSection === APP_SECTIONS.SALES_SECTION ? (
        <DollarProvider>
          <SalesSectionManager />
        </DollarProvider>
      ) : currentSection === APP_SECTIONS.OWE_SECTION ? (
        <OweSectionManager />
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
