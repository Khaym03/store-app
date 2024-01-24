import { useContext } from 'react'
import './Order.css'
import PropTypes from 'prop-types'
import {DollarContext} from './DollarProvider'


const Row = ({ name, quan, price }) => (
  <li className="Order-row ">
    <div className="align-left capitalize label-large">{name}</div>
    <div className="grid-center label-large">{quan}</div>
    <div className="align-right label-large">{price.toFixed(2)}</div>
  </li>
)

Row.propTypes = {
  name: PropTypes.string,
  quan: PropTypes.number,
  price: PropTypes.number
}

const Order = () => {
  const {orders} = useContext(DollarContext)
  return (
   <section className='Order-section surface-1 rounded-md'>
     <ul className="Order">
      {orders.length > 0 &&
        orders.map(([name, quan , price], i) => {
          return <Row key={i} name={name} quan={quan} price={price} />
        })}
    </ul>
   </section>
  )
}

export default Order
