import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './ProductList.css'

const ProductCard = ({ name, value }) => (
  <li className=' on-secondary rounded-md'>
    <div className='name body-large align-left'>{name}</div>
    <span className='body-medium align-right'>{value}</span>
  </li>
)

ProductCard.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number
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
  console.log(data)
  return (
    <div className='ProductList rounded-lg'>
      <ul>
        {data &&
          data.map((prod, i) => (
            <ProductCard key={i} name={prod.name} value={prod.price} />
          ))}
      </ul>
    </div>
  )
}

export default ProductList

