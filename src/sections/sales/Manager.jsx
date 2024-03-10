import React, { useState, useEffect, useRef } from 'react'
import { URLs } from '../../constants'
import PropTypes from 'prop-types'

export const ManagerContext = React.createContext()

const Manager = ({ children }) => {
  const [dollar, setDollar] = useState(0)
  const [total, setTotal] = useState(0)
  const [bs, setBs] = useState(0)
  const [searchingClient, setSearchingClient] = useState('')
  const [notification, setNotification] = useState(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const [selected, setSelected] = useState(null)
  const [orders, setOrders] = useState([])
  const [processedOrders, setProcessedOrders] = useState(null)
  const [triggerProcessOrders, setTriggerProcessOrders] = useState(false)
  const [updateClientList, setUpdateClientList] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('bio')
  const [rangeValue, setRangeValue] = useState(1000)
  const bsConverterRef = useRef()
  const url = URLs.getDollarURL

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setDollar(data))
  }, [url])

  return (
    <ManagerContext.Provider
      value={{
        dollar,
        total,
        setTotal,
        bs,
        setBs,
        searchingClient,
        setSearchingClient,
        notification,
        setNotification,
        initialLoad,
        setInitialLoad,
        selected,
        setSelected,
        orders,
        setOrders,
        updateClientList,
        setUpdateClientList,
        paymentMethod,
        setPaymentMethod,
        bsConverterRef,
        rangeValue,
        setRangeValue,
        triggerProcessOrders,
        setTriggerProcessOrders,
        processedOrders,
        setProcessedOrders
      }}
    >
      {children}
    </ManagerContext.Provider>
  )
}

Manager.propTypes = {
  children: PropTypes.node
}

export default Manager
