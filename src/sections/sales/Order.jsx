import { useContext } from 'react'
import PropTypes from 'prop-types'
import { useTransition, animated } from '@react-spring/web'
import { ManagerContext } from './Manager'

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
    <div className="border-b border-slate-200 grid relative p-4 cols-2-1-1 text-lg font-medium ">
      <span className="align-left capitalize">producto</span>
      <span className="grid place-items-center capitalize">ml</span>
      <span className="align-right capitalize">precio</span>
    </div>
  )
}

const Order = () => {
  const { processedOrders,orders, setOrders,setTriggerProcessOrders } = useContext(ManagerContext)
  const transitions = useTransition(processedOrders, {
    from: { opacity: 0, x: -10 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x:10 },
    keys: item => item? item[0] : 0 // Use the product name as the key
  })

  return (
    <section className="flex flex-col">
      <OrderHeader />
      <div className="w-full h-full rounded-lg">
        <ul className=" auto-rows-min grid w-full h-full overflow-y-auto overflow-x-hidden">
          {transitions(
            (styles, data) =>
              data && (
                <animated.li
                  style={styles}
                  onClick={() => {
                    setOrders(orders.filter(order => order[0] !== data[0]))
                    setTriggerProcessOrders(prev => !prev)
                  }}
                  className={
                    'grid cols-2-1-1 text-sm text-slate-700 font-medium border-b border-slate-100 px-4 py-2 h-10 hover:bg-red-50 cursor-pointer transition-colors hover:text-red-800 overflow-hidden'
                  }
                >
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
