import { useContext } from 'react'
import PropTypes from 'prop-types'
import { useTransition, animated } from '@react-spring/web'
import { DollarContext } from './DollarProvider'

const Row = ({ name, quan, price }) => (
  <>
    <div className="align-left capitalize ">{name}</div>
    <div className="grid place-items-center italic">{parseInt(quan)}</div>
    <div className="align-right italic">{price.toFixed(2)}</div>
  </>
)

Row.propTypes = {
  name: PropTypes.string,
  quan: PropTypes.number,
  price: PropTypes.number
}

const OrderHeader = () => {
  return (
    <div className="Order-header grid relative cols-2-1-1 text-base font-medium">
      <span className="align-left capitalize">producto</span>
      <span className="grid place-items-center capitalize">ml</span>
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
    <section style={{gridArea: 'Order'}} className="p-4">
      <div className='w-full h-full on-tertiary-container-text bg-slate-100 rounded-lg pt-4 pb-4'>
        <OrderHeader />
        <ul className="Order w-full h-full max-h-[240px] grid overflow-y-hidden">
          {transitions(
            (styles, data) =>
              data && (
                <animated.li style={styles}  className={'grid cols-2-1-1 text-sm text-slate-500 font-medium'}>
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