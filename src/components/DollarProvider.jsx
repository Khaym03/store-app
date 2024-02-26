import React, { useState, useEffect } from 'react'
import { URLs } from '../constants'
import PropTypes from 'prop-types'

export const DollarContext = React.createContext()

const DollarProvider = ({ children }) => {
  const [dollar, setDollar] = useState(0)
  const [total, setTotal] = useState(0)
  const [bs, setBs] = useState(0)
  const [searchingClient, setSearchingClient] = useState('')
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [selected, setSelected] = useState([])
  const [orders, setOrders] = useState([])
  const [updateClientList, setUpdateClientList] = useState(true)
  const url = URLs.getDollarURL

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setDollar(data))
  }, [url])

  return (
    <DollarContext.Provider
      value={{
        dollar,
        total,
        setTotal,
        bs,
        setBs,
        searchingClient,
        setSearchingClient,
        showSaveNotification,
        setShowSaveNotification,
        initialLoad,
        setInitialLoad,
        selected,
        setSelected,
        orders,
        setOrders,
        updateClientList, setUpdateClientList
      }}
    >
      {children}
    </DollarContext.Provider>
  )
}

DollarProvider.propTypes = {
  children: PropTypes.node
}

export default DollarProvider
