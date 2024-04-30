import PropTypes from 'prop-types'
import { useTransition, animated } from '@react-spring/web'
import { useContext, useState } from 'react'
import { ManagerContext } from './Manager'
import listOfProducts from '../../listOfProducts'
import { TbBottleFilled } from 'react-icons/tb'
import { TbBottle } from 'react-icons/tb'
import { borderColor } from '../../utils'
import { MdOutlinePlusOne } from 'react-icons/md'
import { MdAdd } from 'react-icons/md'

const NewProduct = ({ animation }) => {
  return (
    <animated.div
      style={animation}
      className="bg-slate-100 rounded-md border-2 border-slate-200 text-slate-400 cursor-pointer grid place-items-center transition"
    >
      <MdAdd size={'2rem'} />
    </animated.div>
  )
}

NewProduct.propTypes = {
  animation: PropTypes.object
}

const ProductCard = ({ name, value, color, animation }) => {
  const transparent = ['cloro', 'acondicionador', 'cera'].includes(name)
  const [isIn, setIsIn] = useState(false)
  const { orders, setOrders, setTriggerProcessOrders, setSelected, selected } =
    useContext(ManagerContext)

  const enterHandler = () => setIsIn(true)
  const outHandler = () => setIsIn(false)
  const clickHandler = e => {
    e.stopPropagation()
    if (selected) setSelected(null)
    setOrders([...orders, [name, 1000, value]])
    setTriggerProcessOrders(prev => !prev)
  }

  const selectHandler = ({ name, price }) => {
    setSelected([name, price])
  }

  return (
    <animated.div
      style={animation}
      className={`bg-white overflow-hidden grid place-items-center capitalize rounded-lg ProductCard h-full font-medium transition relative p-4 border-2 ${
        selected && selected[0] === name
          ? `shadow-md ${borderColor(name)} -translate-y-1`
          : 'border-slate-200 hover:border-slate-500 '
      }`}
      onMouseEnter={enterHandler}
      onMouseLeave={outHandler}
      onClick={() => selectHandler({ name, price: value })}
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
    </animated.div>
  )
}

ProductCard.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  color: PropTypes.string,
  animation: PropTypes.object
}

function ProductList() {
  const plusEmpty = [
    ...listOfProducts,
    {
      name: '',
      price: 0,
      color: ''
    }
  ]
  const transitions = useTransition(plusEmpty, {
    from: { scale: 0, opacity: 0 },
    enter: { scale: 1, opacity: 1 },
    config: { duration: 30 },
    trail: 25,
    keys: item => item.name // Use the product name as the key
  })

  return (
    <div className="ProductList row-span-3">
      <ul className="grid grid-cols-2 auto-rows-fr border-r border-slate-200 h-full list-none overflow-y-auto p-4 gap-2">
        {transitions((animation, product) =>
          product === plusEmpty.at(-1) ? (
            <NewProduct animation={animation} />
          ) : (
            <ProductCard
              name={product.name}
              value={product.price}
              color={product.color}
              animation={animation}
            />
          )
        )}
      </ul>
    </div>
  )
}

export default ProductList
