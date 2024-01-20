import { useState } from 'react'
import ProductList from './ProductList.jsx'
import Measure from './Measure.jsx'
import Order from './Order.jsx'

const SalesSectionManager = () => {
  const [selected, setSelected] = useState([])
  const [rangeValue, setRangeValue] = useState(1000)
  const [orders, setOrders] = useState([])

  return (
    <section className="mainSection">
      <ProductList selected={selected} setSelected={setSelected} />
      <Measure
        selected={selected}
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
        orders={orders}
        setOrders={setOrders}
      />
      <Order orders={orders} />
    </section>
  )
}

export default SalesSectionManager
