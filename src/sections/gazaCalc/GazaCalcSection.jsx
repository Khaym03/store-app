import { forwardRef, useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import listOfProducts from '../../listOfProducts'
import { GazaCalcContext } from './GazaCalcProvider'
import { matchBg } from '../../utils'
import { useTransition, animated } from '@react-spring/web'
import Button from '../../comp/Button'
import { URLs } from '../../constants'
import Title from '../../comp/Title'
import Input from '../../comp/Input'

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
      className={`transition shadow-sm flex items-center px-4 py-2 border rounded-lg cursor-pointer h-12 ${
        selected
          ? ' border-red-400 text-red-400'
          : ' border-slate-200 hover:border-slate-400'
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
  <div className='mb-4'>
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
      const paramsToTheCalcFunc = { bs, ignoreProducts: [...ignoreProducts.values()], discount }
      fetch(URLs.getOptimalPurchaseURL,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paramsToTheCalcFunc) // body data type must match "Content-Type" header
      })
      .then(res => res.ok ? res.json() : console.log(res))
      .then(data => {
        setProductToBebough(new Map(Object.entries(data)))
        setCalcOptimalPurchase(false)
      })
    }
  }, [
    calcOptimalPurchase,
    ignoreProducts,
    setCalcOptimalPurchase,
    bs,
    discount
  ])

  const transition = useTransition(
    productToBebough ? [...productToBebough.entries()] : [],
    {
      from: { x: -10, opacity: 0 },
      enter: { x: 0, opacity: 1 },
      trail: 15
    }
  )

  return (
    <ul className="grid auto-rows-[45.5px] capitalize font-medium italic items-center">
      {transition((style, [name, amount]) => {
        const bg = matchBg(name)
        return (
          <animated.li
            style={style}
            key={name}
            className={
              'rounded-md px-4 py-3 text-slate-600 text-sm relative grid cols-1-3-1'
            }
          >
            <span className={`w-5 h-5 ${bg} rounded-full`}></span>
            <span>{name}</span>
            <span>{amount + ' Lts'}</span>
          </animated.li>
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
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Input ref={budgetRef} placeholder='Presupuesto'/>
        <Input ref={discountRef} placeholder='Descuento'/>
      </div>
      <Button clickHandler={clickhandler} actionType="main">calcular</Button>
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

  const transition = useTransition(onDemand, {
    from: { x: 25, opacity: 0.1 },
    enter: { x: 0, opacity: 1 }
  })

  return firstStage ? (
    <StageOne />
  ) : onDemand ? (
    transition(style => (
      <animated.section
        style={style}
        className="grid grid-cols-2 gap-4 rounded-lg shadow-sm h-fit"
      >
        <div className=" border border-slate-200 p-8 rounded-lg my-auto">
          <OptimalPurchaseSection />
        </div>
        <div className="border border-slate-200 p-8 rounded-lg shadow-sm my-auto h-full">
          <ProductToBeBough />
        </div>
      </animated.section>
    ))
  ) : null
}

export default GazaCalcSection
