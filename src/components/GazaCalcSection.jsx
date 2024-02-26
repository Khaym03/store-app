import { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import listOfProducts from '../listOfProducts'
import { GazaCalcContext } from './GazaCalcProvider'
import calc from '../calcOptimalPurchase'

const ProductTags = ({ productName }) => {
  const [selected, setSelected] = useState(false)
  const { ignoreProducts, setIgnoreProducts } = useContext(GazaCalcContext)

  const clickhandler = () => {
    selected
      ? ignoreProducts.delete(productName)
      : setIgnoreProducts(ignoreProducts.set(productName, productName))

    setSelected(!selected)
  }

  return (
    <li
      onClick={clickhandler}
      className={`transition hover:scale-105 shadow-sm flex items-center p-4 border-solid border-2 rounded-lg cursor-pointer ${
        selected ? ' border-red-400 text-red-400' : ' border-slate-100'
      }`}
    >
      {productName}
    </li>
  )
}

ProductTags.propTypes = {
  productName: PropTypes.string
}

const ProductGrid = () => {
  const productNames = listOfProducts.map(product => product.name)

  return (
    <div className="flex flex-col">
      <header className="font-medium text-slate-600 flex items-center mb-2">
        Seleccione los productos a descartar:
      </header>
      <ul className=" text-sm font-medium text-slate-500 capitalize grid gap-2 grid-cols-3 grid-row-3 mb-4">
        {productNames.map(productName => (
          <ProductTags key={productName} productName={productName} />
        ))}
      </ul>
    </div>
  )
}

const ProductToBeBough = ({ bs }) => {
  const { ignoreProducts, calcOptimalPurchase, setCalcOptimalPurchase } =
    useContext(GazaCalcContext)

  const [productToBebough, setProductToBebough] = useState(null)

  useEffect(() => {
    if (calcOptimalPurchase) {
      calc(bs, ignoreProducts).then(data => setProductToBebough(data))
      setCalcOptimalPurchase(false)
    }
  }, [calcOptimalPurchase, ignoreProducts, setCalcOptimalPurchase, bs])
  return (
    <ul className="grid grid-cols-3 gap-2 capitalize font-medium italic items-center">
      {productToBebough &&
        [...productToBebough.entries()].map(([name, amount]) => {
          return (
            <li
              key={name}
              className={
                'border-solid border-slate-200 border-2 rounded-md shadow-sm p-4 text-slate-600 text-sm'
              }
            >{`${name} -> ${amount}`}</li>
          )
        })}
    </ul>
  )
}

ProductToBeBough.propTypes = {
  bs: PropTypes.number
}

const OptimalPurchaseSection = () => {
  const { setCalcOptimalPurchase } = useContext(GazaCalcContext)
  const [bs, setBs] = useState(0)
  const budgetRef = useRef(null)

  const clickhandler = () => {
    const value = +budgetRef.current.value

    if (!isNaN(value)) {
      setBs(value)
      setCalcOptimalPurchase(true)
    }
  }

  return (
    <>
      <h2 className="capitalize font-bold text-3xl mb-4">
        calcula la compra mas optima
      </h2>
      <ProductGrid />
      <div className="grid gap-2 mb-4">
        <input
          ref={budgetRef}
          type="text"
          placeholder="Presupuesto"
          className="h-14 p-2 border-solid border-2 border-slate-100 shadow-sm rounded-lg font-medium italic text-center"
        />
        <button
          onClick={clickhandler}
          className="bg-blue-100 text-sky-700 hover:bg-blue-200 transition-colors h-14 rounded-lg capitalize"
        >
          calcular
        </button>
      </div>
      <ProductToBeBough bs={bs} />
    </>
  )
}

const GazaCalcSection = () => {
  return (
    <section className="section grid grid-cols-2 gap-4 rounded-lg">
      <div className="border-solid border-2 border-slate-100 p-4 rounded-lg">
        <OptimalPurchaseSection />
      </div>
      <div className="border-solid border-2 border-slate-100"></div>
    </section>
  )
}

export default GazaCalcSection
