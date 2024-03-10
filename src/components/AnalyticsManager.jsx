import { useState, createContext } from 'react'
import PropTypes from 'prop-types'

export const AnalyticContext = createContext()

const AnalyticManager = ({ children }) => {
  const [averageSale, setAverageSale] = useState(0)
  const [data, setData] = useState(null)
  const [percentages, setPercentages] = useState(null)
  const [salesActivity, setSalesActivity] = useState(null)
  const [currentChart, setCurrentChart] = useState(0)

  return (
    <AnalyticContext.Provider
      value={{
        averageSale,
        setAverageSale,
        data,
        setData,
        percentages,
        setPercentages,
        salesActivity,
        setSalesActivity,
        currentChart,
        setCurrentChart
      }}
    >
      {children}
    </AnalyticContext.Provider>
  )
}

AnalyticManager.propTypes = {
  children: PropTypes.node
}

export default AnalyticManager
