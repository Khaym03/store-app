import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { DollarContext } from './DollarProvider'
import './ProductList.css'

const ProductCard = ({ name, value, clickHandler }) => {
  const dollar = useContext(DollarContext),
    profit = 1.5

  let price
  if (name === 'cloro') price = (value / 100) * dollar * 3
  else price = (value / 100) * dollar * profit

  return (
    <li
      className="def-border rounded-md transition-border-color pointer"
      onClick={clickHandler}
    >
      <div data-name={name} className="name body-large align-left">
        {name}
      </div>
      <span data-price={price.toFixed(2)} className="body-medium align-right">
        {price.toFixed(2)}
      </span>
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

const getNameAndPrice = target => {
  const name = target.querySelector('[data-name]').getAttribute('data-name')
  const price = Number(
    target.querySelector('[data-price]').getAttribute('data-price')
  )

  return [name, price]
}

function ProductList({ selected, setSelected }) {
  const { data } = FetchProducts()
  return (
    <div className="ProductList rounded-lg">
      <ul>
        {data &&
          data.map((prod, i) => (
            <ProductCard
              key={i}
              name={prod.name}
              value={prod.price}
              clickHandler={e => {
                const li = Array.from(
                  document.querySelectorAll('.ProductList li')
                )

                if (selected) {
                  li.forEach(li => li.classList.remove('focus-border'))
                  e.target.classList.add('focus-border')
                  setSelected(getNameAndPrice(e.target))
                } else {
                  e.target.classList.add('focus-border')
                  setSelected(getNameAndPrice(e.target))
                }
              }}
            />
          ))}
      </ul>
    </div>
  )
}

ProductList.propTypes = {
  selected: PropTypes.array,
  setSelected: PropTypes.func
}

export default ProductList
