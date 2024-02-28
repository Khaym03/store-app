import { useState, createContext } from 'react'
import PropTypes from 'prop-types'

export const GazaCalcContext = createContext()

const GazaCalcProvider = ({ children }) => {
  const [ignoreProducts, setIgnoreProducts] = useState(new Map())
  const [calcOptimalPurchase, setCalcOptimalPurchase] = useState(false)
  const [bs, setBs] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [onDemand, setOnDemand] = useState(false)

  const [firstStage, setFirstStage] = useState(true)

  return (
    <GazaCalcContext.Provider
      value={{
        ignoreProducts,
        setIgnoreProducts,
        calcOptimalPurchase,
        setCalcOptimalPurchase,
        bs,
        setBs,
        discount,
        setDiscount,
        firstStage,
        setFirstStage,
        onDemand,
        setOnDemand
      }}
    >
      {children}
    </GazaCalcContext.Provider>
  )
}

GazaCalcProvider.propTypes = {
  children: PropTypes.node
}

export default GazaCalcProvider
