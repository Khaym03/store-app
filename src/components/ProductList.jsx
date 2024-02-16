import PropTypes from 'prop-types'
import { useTransition, animated } from '@react-spring/web'
import './ProductList.css'
import { useContext } from 'react'
import { DollarContext } from './DollarProvider'

const ProductCard = ({ name, value }) => {
  return (
    <div className=" rounded-lg  ProductCard full text-base font-medium">
      <div className="name align-left">{name}</div>
      <span className="align-right italic">
        {value.toFixed(2)}
      </span>
    </div>
  )
}

ProductCard.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number
}

function ProductList() {
  const {selected,setSelected} = useContext(DollarContext)
  const data = [
    {
      name: 'acondicionador',
      price: 45
    },
    {
      name: 'ariel',
      price: 33
    },
    {
      name: 'cera',
      price: 28
    },
    {
      name: 'cloro',
      price: 18
    },
    {
      name: 'desengrasante',
      price: 45
    },
    {
      name: 'desinfectante',
      price: 20
    },
    {
      name: 'lavaplatos',
      price: 33
    },
    {
      name: 'shampoo',
      price: 45
    },
    {
      name: 'suavizante',
      price: 25
    }
  ]

  const transitions = useTransition(data, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    keys: item => item.name // Use the product name as the key
  })

  const clickHandler = ({ name, price }) => setSelected([name, price])

  return (
    <div className="ProductList rounded-lg">
      <ul className="p-1">
        {transitions((styles, product) => (
          <animated.li
            style={styles}
            className={`full rounded-lg def-border transition-border-color pointer ProductCard-wrapper text-semi-transparent ${
              selected && selected[0] === product.name ? 'focus-border' : ''
            }`}
            onClick={() => clickHandler(product)}
          >
            <ProductCard name={product.name} value={product.price} />
          </animated.li>
        ))}
      </ul>
    </div>
  )
}

// ProductList.propTypes = {
//   selected: PropTypes.array,
//   setSelected: PropTypes.func
// }

export default ProductList