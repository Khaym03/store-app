import { useState, createContext, useRef } from 'react'
import PropTypes from 'prop-types'

export const OweContext = createContext()

const OweProvider = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState([])
  const [selectedSales, setSelectedSales] = useState([])
  const detailedClientUlRef = useRef()
  return (
    <OweContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        detailedClientUlRef,
        selectedSales,
        setSelectedSales
      }}
    >
      {children}
    </OweContext.Provider>
  )
}

OweProvider.propTypes = {
  children: PropTypes.node
}

export default OweProvider
