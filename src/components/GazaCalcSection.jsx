import { forwardRef, useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import listOfProducts from '../listOfProducts'
import { GazaCalcContext } from './GazaCalcProvider'
import calc from '../calcOptimalPurchase'

const Title = ({ children }) => (
  <h2 className="capitalize font-black text-3xl mb-4 pointer-events-none">
    {children}
  </h2>
)
Title.propTypes = {
  children: PropTypes.node
}

const BasicInput = forwardRef(({ placeholder }, ref) => {
  return (
    <input
      ref={ref}
      className="border-2 border-slate-200 text-center capitalize rounded-lg"
      type="text"
      placeholder={placeholder}
    />
  )
})
BasicInput.displayName = 'BasicInput'

BasicInput.propTypes = {
  placeholder: PropTypes.string
}

const ActionBtn = ({ text, clickHandler }) => {
  return (
    <button
      onClick={clickHandler}
      className="bg-blue-100 text-sky-700 hover:bg-blue-200 transition-colors h-14 rounded-lg capitalize p-4 w-full"
    >
      {text}
    </button>
  )
}

ActionBtn.propTypes = {
  text: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired
}

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
      className={`transition shadow-sm flex items-center p-4 border-solid border-2 rounded-lg cursor-pointer ${
        selected
          ? ' border-red-400 text-red-400'
          : ' border-slate-100 hover:border-slate-300'
      }`}
    >
      {productName}
    </li>
  )
}

ProductTags.propTypes = {
  productName: PropTypes.string
}

const NineTales = ({ children, suggestion }) => (
  <div>
    <p className="font-medium text-slate-600 flex items-center mb-2">
      {suggestion}
    </p>
    <ul className="text-sm font-medium text-slate-500 capitalize grid gap-2 grid-cols-3 grid-row-3 mb-4">
      {children}
    </ul>
  </div>
)

NineTales.propTypes = {
  children: PropTypes.node,
  suggestion: PropTypes.string
}

const ProductToBeBough = () => {
  const {
    ignoreProducts,
    calcOptimalPurchase,
    setCalcOptimalPurchase,
    bs,
    discount
  } = useContext(GazaCalcContext)

  const [productToBebough, setProductToBebough] = useState(null)

  useEffect(() => {
    if (calcOptimalPurchase) {
      calc(bs, ignoreProducts, discount).then(data => setProductToBebough(data))
      setCalcOptimalPurchase(false)
    }
  }, [
    calcOptimalPurchase,
    ignoreProducts,
    setCalcOptimalPurchase,
    bs,
    discount
  ])
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

const OptimalPurchaseSection = () => {
  const { setCalcOptimalPurchase, setBs, setDiscount } =
    useContext(GazaCalcContext)
  const budgetRef = useRef(null)
  const discountRef = useRef(null)

  const clickhandler = () => {
    const budget = +budgetRef.current.value
    const discount = +discountRef.current.value

    if (!isNaN(budget) && !isNaN(discount)) {
      setBs(budget)
      setDiscount(discount)
      setCalcOptimalPurchase(true)
    }
  }

  return (
    <>
      <Title>calcula la compra mas optima</Title>
      <NineTales suggestion={'Seleccione los productos a descartar:'}>
        {listOfProducts.map(({ name }) => (
          <ProductTags key={name} productName={name} />
        ))}
      </NineTales>
      <div className="grid grid-cols-2 gap-2 mb-4 h-14">
        <BasicInput ref={budgetRef} placeholder="presupuesto" />
        <BasicInput ref={discountRef} placeholder="descuento" />
      </div>
      <ActionBtn text={'calcular'} clickHandler={clickhandler} />
    </>
  )
}

const StageOne = () => {
  const { setOnDemand, setFirstStage } = useContext(GazaCalcContext)
  const showOnDemand = () => {
    setOnDemand(true)
    setFirstStage(false)
  }

  return (
    <section className="w-full h-full grid grid-cols-2 relative">
      <h1 className="capitalize absolute font-black text-5xl left-2/4 top-16 -translate-x-2/4 pointer-events-none">
        Como quieres calcular?
      </h1>
      <div
        onClick={showOnDemand}
        className=" cursor-pointer transition hover:bg-slate-100 overflow-hidden"
      >
        <div className="w-full transition-transform h-full flex justify-center flex-col items-center hover:scale-125">
          <Title>por demanda</Title>
          <span className="text-5xl">🧠</span>
        </div>
      </div>
      <div className=" transition  cursor-pointer hover:bg-slate-100 overflow-hidden">
        <div className="w-full transition-transform h-full flex justify-center flex-col items-center hover:scale-125">
          <Title>manualmente</Title>
          <span className="text-5xl">🤓</span>
        </div>
      </div>
    </section>
  )
}

const GazaCalcSection = () => {
  const { onDemand, firstStage } = useContext(GazaCalcContext)

  return firstStage ? (
    <StageOne />
  ) : onDemand ? (
    <section className="section grid grid-cols-2 gap-4 rounded-lg shadow-sm">
      <div className=" border border-slate-200 p-8 rounded-lg my-auto">
        <OptimalPurchaseSection />
      </div>
      <div className="border border-slate-200 p-8 rounded-lg shadow-sm my-auto">
        <ProductToBeBough />
      </div>
    </section>
  ) : null
}

export default GazaCalcSection
