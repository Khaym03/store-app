import { createContext } from 'react'
import PropTypes from 'prop-types'

export const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {

  return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>
}

GlobalProvider.propTypes = {
  children: PropTypes.node
}

export default GlobalProvider
