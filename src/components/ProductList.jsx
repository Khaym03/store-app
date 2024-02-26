import PropTypes from 'prop-types'
import { useTransition, animated } from '@react-spring/web'
import { useContext } from 'react'
import { DollarContext } from './DollarProvider'
import listOfProducts from '../listOfProducts'
import { TbBottleFilled } from 'react-icons/tb'
import { TbBottle } from 'react-icons/tb'

const borderColor = product => {
  switch (product) {
    case 'ariel':
      return 'border-blue-400'
    case 'desengrasante':
      return 'border-orange-400'
    case 'desinfectante':
      return 'border-red-400'
    case 'lavaplatos':
      return 'border-green-400'
    case 'suavizante':
      return 'border-purple-400'
    case 'limpia poceta':
      return 'border-amber-400'

    default:
      return 'border-slate-400'
  }
}

const ProductCard = ({ name, value, color }) => {
  const transparent = ['cloro', 'acondicionador', 'cera'].includes(name)

  return (
    <div
      className={`overflow-hidden grid place-items-center capitalize rounded-lg ProductCard h-full font-medium transition-colors relative p-4`}
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
    </div>
  )
}

ProductCard.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  color: PropTypes.string
}

function ProductList() {
  const { selected, setSelected } = useContext(DollarContext)

  const transitions = useTransition(listOfProducts, {
    from: { scale: 0, opacity: 0 },
    enter: { scale: 1, opacity: 1 },
    config: { duration: 30 },
    trail: 15,
    keys: item => item.name // Use the product name as the key
  })

  const clickHandler = ({ name, price }) => setSelected([name, price])

  return (
    <div style={{ gridArea: 'ProductList' }} className="ProductList rounded-lg">
      <ul className="grid grid-cols-2 auto-rows-[127px] gap-2 h-full list-none overflow-y-auto p-4">
        {transitions((styles, product) => (
          <animated.li
            style={styles}
            className={`rounded-lg border-solid border-2  ProductList transition cursor-pointer  text-slate-600   ${
              selected && selected[0] === product.name
                ? `shadow-md ${borderColor(product.name)}`
                : 'border-slate-100 hover:border-slate-200'
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
