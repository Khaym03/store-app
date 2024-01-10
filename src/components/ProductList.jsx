import { useState, useEffect, /*useContext*/ } from 'react'
import PropTypes from 'prop-types'
// import {DollarContext} from './DollarProvider'
import './ProductList.css'

const ProductCard = ({ name, value, clickHandler }) => {
  return (
    <li
      className="def-border rounded-md transition-border-color pointer"
      onClick={clickHandler}
    >
      <div className="name body-large align-left">{name}</div>
      <span className="body-medium align-right">{value}</span>
    </li>
  )
}

ProductCard.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  clickHandler: PropTypes.func.isRequired
}

const FetchProducts = () => {
  const url = 'http://localhost:1234/getProducts'

  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error('Error fetching data')
        }
      })
      .then(data => {
        setData(data)
      })
  }, [url])

  return { data }
}

function ProductList() {
  const { data } = FetchProducts()
  const [isFocus, setIsFocus] = useState(false)
  // const dollar = useContext(DollarContext)

  const handlerClick = e => {
    const li = Array.from(document.querySelectorAll('.ProductList li'))

    if (isFocus) {
      li.forEach(li => li.classList.remove('focus-border'))
      e.target.classList.add('focus-border')
      setIsFocus(true)
    } else {
      e.target.classList.add('focus-border')
      setIsFocus(true)
    }
  }

  return (
    <div className="ProductList rounded-lg">
      <ul>
        {data &&
          data.map((prod, i) => (
            <ProductCard
              key={i}
              name={prod.name}
              value={prod.price}
              clickHandler={handlerClick}
            />
          ))}
      </ul>
    </div>
  )
}

export default ProductList
