import { useContext, useState } from 'react'
import ProductList from './ProductList.jsx'
import Measure from './Measure.jsx'
import Order from './Order.jsx'
import SalesStorager from './SalesStorager.jsx'
import Notification from '../comp/Notification.tsx'

import { DollarContext } from './DollarProvider.jsx'

const SalesSectionManager = () => {
  const [rangeValue, setRangeValue] = useState(1000)
  const { notification } = useContext(DollarContext)
  return (
    <section className="mainSection gap-8 section grid">
      <ProductList />
      <Measure rangeValue={rangeValue} setRangeValue={setRangeValue} />
      <Order />
      <SalesStorager />
      <Notification notification={notification} />
    </section>
  )
}

export default SalesSectionManager
