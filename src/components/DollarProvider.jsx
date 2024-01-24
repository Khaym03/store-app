import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export const DollarContext = React.createContext()

const DollarProvider = ({ children }) => {
  const [dollar, setDollar] = useState(0)
  const [orders, setOrders] = useState([])
  const url = 'http://localhost:1234/getDollar'

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setDollar(data))
  }, [url])

  return (
    <DollarContext.Provider value={{dollar, orders, setOrders}}>
      <main id="content" className="grid-center">
        {children}
      </main>
    </DollarContext.Provider>
  )
}

DollarProvider.propTypes = {
  children: PropTypes.node
}

export default DollarProvider
