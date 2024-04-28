import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useTransition, animated } from '@react-spring/web'
import { ManagerContext } from './Manager'
import { IoCloseOutline } from 'react-icons/io5'

const Row = ({ name, quan, price }) => {
  const [isIn, setIsIn] = useState(false)
  const enter = () => setIsIn(true)
  const out = () => setIsIn(false)

  const lts = quan / 1000
  const amount = Number.isInteger(lts) ? lts : lts.toFixed(1)

  return (
    <div onMouseEnter={enter} onMouseLeave={out}>
      <span
        className={`absolute top-2 right-2 pointer-events-none transition-opacity ${
          isIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <IoCloseOutline className="text-red-400" size={'1.5rem'} />
      </span>
      <div className="text-xl italic text-slate-700">
        {amount} <span className="text-sm">Lts</span>
      </div>
      <div className="align-right italic text-sm text-slate-600">
        {price.toFixed(2)} Bs
      </div>
      <div className="capitalize text-sm text-slate-500">{name}</div>
    </div>
  )
}

Row.propTypes = {
  name: PropTypes.string,
  quan: PropTypes.number,
  price: PropTypes.number
}

const Order = () => {
  const {
    processedOrders,
    orders,
    setOrders,
    setTriggerProcessOrders,
    setSelected
  } = useContext(ManagerContext)
  const transitions = useTransition(processedOrders, {
    from: { opacity: 0, x: -10 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: 10 },
    keys: item => (item ? item[0] : 0) // Use the product name as the key
  })

  return (
    <section className="flex flex-col">
      <div className="w-full h-full rounded-lg">
        <ul className="grid w-full h-full overflow-y-auto overflow-x-hidden grid-cols-3 auto-rows-min gap-2  p-4 bg-slate-50">
          {transitions(
            (styles, data) =>
              data && (
                <animated.li
                  style={styles}
                  onClick={() => {
                    // unfocus the selected product to prevent a weird bug where if is
                    // selected and u try delete de item it add one to the orders
                    setSelected(null)
                    setOrders(orders.filter(order => order[0] !== data[0]))
                    setTriggerProcessOrders(prev => !prev)
                  }}
                  className={
                    ' px-4 py-2 text-sm text-slate-700 font-medium bg-white border-b border-slate-200 cursor-pointer transition-colors hover:border-red-400 overflow-hidden w-full h-full border rounded-md relative'
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
