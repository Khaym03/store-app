import { useState } from 'react'
import ProductList from './ProductList.jsx'
import Measure from './Measure.jsx'
import Order from './Order.jsx'
import SalesStorager from './SalesStorager.jsx'

const SalesSectionManager = () => {
  const [selected, setSelected] = useState([])
  const [rangeValue, setRangeValue] = useState(1000)
  const [total, setTotal] = useState(0)

  return (
    <section className="mainSection">
      <ProductList selected={selected} setSelected={setSelected} />
      <Measure
        selected={selected}
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
        setTotal={setTotal}
      />
      <Order/>
      <SalesStorager total={total} setTotal={setTotal}/>
    </section>
  )
}

export default SalesSectionManager
