import { useState,createContext } from "react";
import PropTypes from "prop-types"

export const GazaCalcContext = createContext()

const GazaCalcProvider = ({children}) => {
    const [ignoreProducts,setIgnoreProducts] = useState(new Map())
    const [calcOptimalPurchase, setCalcOptimalPurchase] = useState(false)

    return (<GazaCalcContext.Provider value={{
        ignoreProducts,setIgnoreProducts,calcOptimalPurchase, setCalcOptimalPurchase
    }}>
        {children}
    </GazaCalcContext.Provider>)
}

GazaCalcProvider.propTypes = {
    children: PropTypes.node
}

export default GazaCalcProvider