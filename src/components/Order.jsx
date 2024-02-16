import { useContext } from 'react'
import './Order.css'
import PropTypes from 'prop-types'
import { DollarContext } from './DollarProvider'
import { useTransition, animated } from '@react-spring/web'

const Row = ({ name, quan, price }) => (
  <>
    <div className="align-left capitalize ">{name}</div>
    <div className="grid-center ">{parseInt(quan)}</div>
    <div className="align-right ">{price.toFixed(2)}</div>
  </>
)

Row.propTypes = {
  name: PropTypes.string,
  quan: PropTypes.number,
  price: PropTypes.number
}

const OrderHeader = () => {
  return (
    <div className="Order-header order-cols body-large bold">
      <span className="align-left capitalize">producto</span>
      <span className="grid-center capitalize">ml</span>
      <span className="align-right capitalize">precio</span>
    </div>
  )
}

const Order = () => {
  const { orders } = useContext(DollarContext)
  const transitions = useTransition(orders, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    keys: item => item[0] // Use the product name as the key
  })
  return (
    <section className="Order-section">
      <div className='full on-tertiary-container-text surface-light rounded-lg pt-1 pb-1'>
        <OrderHeader />
        <ul className="Order ">
          {transitions(
            (styles, data) =>
              data && (
                <animated.li style={styles}  className={'Order-row order-cols label-large'}>
                  <Row name={data[0]} quan={data[1]} price={data[2]} />
                </animated.li>
              )
          )}
        </ul>
      </div>
    </section>
  )
}

export default Order