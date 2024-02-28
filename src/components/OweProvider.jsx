import { useState, createContext, useRef } from 'react'
import PropTypes from 'prop-types'

export const OweContext = createContext()

const OweProvider = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState(null)
  const [triggerUpdate, setTriggerUpdate] = useState(true)
  const detailedClientUlRef = useRef()
  return (
    <OweContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        detailedClientUlRef,
        triggerUpdate,
        setTriggerUpdate
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
