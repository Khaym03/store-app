import { useState } from 'react'
import ProductList from './ProductList.jsx'
import Measure from './Measure.jsx'
import Order from './Order.jsx'
import SalesStorager from './SalesStorager.jsx'
import Notification from './Notification.jsx'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

const SalesSectionManager = () => {
  const [rangeValue, setRangeValue] = useState(1000)

  return (
    <section className="mainSection section">
      <ProductList />
      <Measure rangeValue={rangeValue} setRangeValue={setRangeValue} />
      <Order />
      <SalesStorager />
      <Notification
        message={'Guardado correctamente'}
        Icon={IoMdCheckmarkCircleOutline}
      />
    </section>
  )
}

export default SalesSectionManager
