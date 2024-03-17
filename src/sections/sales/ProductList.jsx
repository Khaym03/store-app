import PropTypes from 'prop-types'
import { useTransition, animated } from '@react-spring/web'
import { useContext, useState } from 'react'
import { ManagerContext } from './Manager'
import listOfProducts from '../../listOfProducts'
import { TbBottleFilled } from 'react-icons/tb'
import { TbBottle } from 'react-icons/tb'
import { borderColor } from '../../utils'
import { MdOutlinePlusOne } from 'react-icons/md'

const ProductCard = ({ name, value, color }) => {
  const transparent = ['cloro', 'acondicionador', 'cera'].includes(name)
  const [isIn, setIsIn] = useState(false)
  const { orders, setOrders, setTriggerProcessOrders,setSelected, selected } =
    useContext(ManagerContext)

  const enterHandler = () => setIsIn(true)
  const outHandler = () => setIsIn(false)
  const clickHandler = e => {
    e.stopPropagation()
    if(selected) setSelected(null)
    setOrders([...orders, [name, 1000, value]])
    setTriggerProcessOrders(prev => !prev)
  }

  return (
    <div
      className={`bg-white overflow-hidden grid place-items-center capitalize rounded-lg ProductCard h-full font-medium transition-colors relative p-4`}
      onMouseEnter={enterHandler}
      onMouseLeave={outHandler}
    >
      <span
        className={`grid place-items-center w-full h-full rounded-md ${color}`}
      >
        {transparent ? (
          <TbBottle size={'2rem'} />
        ) : (
          <TbBottleFilled size={'2rem'} />
        )}
      </span>

      <div className="z-10 text-sm w-full text-left text-slate-900">{name}</div>
      <span className="z-10 text-slate-400 text-xs w-full text-left italic ">
        {value.toFixed(2)}
      </span>
      <span
        onClick={clickHandler}
        id={name}
        className={`${
          isIn ? 'visible scale-100 bg-slate-100' : 'invisible scale-75'
        } absolute top-1 right-1  p-2 transition-transform rounded-md `}
      >
        <MdOutlinePlusOne size={'1.5rem'} />
      </span>
    </div>
  )
}

ProductCard.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  color: PropTypes.string
}

function ProductList() {
  const { selected, setSelected } = useContext(ManagerContext)

  const transitions = useTransition(listOfProducts, {
    from: { scale: 0, opacity: 0 },
    enter: { scale: 1, opacity: 1 },
    config: { duration: 30 },
    trail: 15,
    keys: item => item.name // Use the product name as the key
  })

  const clickHandler = ({ name, price }) => {
    setSelected([name, price])
  }

  return (
    <div className="ProductList row-span-3">
      <ul className="grid grid-cols-2 auto-rows-fr border-r border-slate-200 h-full list-none overflow-y-auto p-4 gap-2">
        {transitions((styles, product) => (
          <animated.li
            style={styles}
            className={`border rounded-md  ProductList transition cursor-pointer  text-slate-600   ${
              selected && selected[0] === product.name
                ? `shadow-md ${borderColor(product.name)}`
                : 'border-slate-200 hover:border-slate-400'
            }`}
            onClick={() => clickHandler(product)}
          >
            <ProductCard
              name={product.name}
              value={product.price}
              color={product.color}
            />
          </animated.li>
        ))}
      </ul>
    </div>
  )
}

export default ProductList
