import PropTypes from 'prop-types'
import { useContext, useEffect, useRef, useState } from 'react'
import { DollarContext } from './DollarProvider'
import { MdAdd } from 'react-icons/md'
import Button from '../comp/Button'

const calcMls = (x, price) => x / price

const Converter = ({ setRangeValue }) => {
  const { bs, setBs, selected } = useContext(DollarContext)

  const handleChange = e => {
    if (selected) {
      const price = selected[1]
      const value = Number(e.target.value),
        ml = calcMls(value, price) * 1000

      setBs(value)
      setRangeValue(ml)
    }
  }

  return (
    <div className="relative w-full h-full ">
      <input
        className="absolute text-center w-full h-full text-md font-medium rounded-lg border-solid border-2 border-slate-100 shadow-sm"
        type="text"
        placeholder="Bs"
        value={!bs ? '' : bs}
        onChange={handleChange}
      />
    </div>
  )
}

Converter.propTypes = {
  setRangeValue: PropTypes.func
}

const InputRange = ({ setRangeValue, inputRef }) => {
  const changeHandler = e => {
    const value = Number(e.target.value)
    if (Number.isNaN(value)) return

    setRangeValue(value)
  }

  return (
    <div className="min-h-16 rounded-lg gap-2 grid grid-cols-2 place-items-center relative transition-colors">
      <input
        id="measure-range"
        type="text"
        ref={inputRef}
        onChange={changeHandler}
        placeholder="Ingrese los ML"
        className="cursor-pointer w-full h-full text-base font-medium text-center rounded-lg transition-colors border-solid border-2 border-slate-100 shadow-sm"
      />
      <Converter setRangeValue={setRangeValue} />
    </div>
  )
}

InputRange.propTypes = {
  setRangeValue: PropTypes.func.isRequired,
  inputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
}

const MeasureUnits = ({ setRangeValue }) => {
  const clickHandler = ({ currentTarget }) => {
    let fr = currentTarget.textContent
    const unit = 1000

    switch (fr) {
      case '1/4':
        fr = 1 / 4
        break
      case '1/2':
        fr = 1 / 2
        break
      case '1':
        fr = 1
        break
    }
    setRangeValue(fr * unit)
  }

  return (
    <div className="MeasureUnits grid grid-cols-3 gap-2 min-h-16 py-2">
      <Button clickHandler={clickHandler} actionType="main">
        1/4
      </Button>
      <Button clickHandler={clickHandler} actionType="main">
        1/2
      </Button>
      <Button clickHandler={clickHandler} actionType="main">
        1
      </Button>
    </div>
  )
}

MeasureUnits.propTypes = {
  setRangeValue: PropTypes.func.isRequired
}

const ShowUnit = ({ rangeValue }) => {
  return (
    <div className="bg-slate-100 text-lg font-medium w-full h-full grid place-items-center rounded-lg italic">{`${parseInt(
      rangeValue
    )} ml`}</div>
  )
}

ShowUnit.propTypes = {
  rangeValue: PropTypes.number
}

const AddToCart = ({
  rangeValue,
  orderWasAdded,
  setOrderWasAdded,
  inputRef
}) => {
  const { orders, setOrders, setTotal, bs, setBs, selected } =
    useContext(DollarContext)

  const formattedOrder = () => {
    const [name, price] = selected
    let fixedPrice
    if (bs) {
      const ml = calcMls(bs, price),
        fixedMl = parseInt(ml * 1000)

      fixedPrice = Number((ml * price).toFixed(2))
      return [name, fixedMl, fixedPrice]
    } else {
      fixedPrice = Number(((rangeValue / 1000) * price).toFixed(2))
      return [name, rangeValue, fixedPrice]
    }
  }

  const clickHandler = () => {
    if (selected) {
      const newOrder = formattedOrder()

      const map = new Map()
      const merged = [...orders, newOrder]

      merged.forEach(([name, quan, price]) => {
        if (!map.has(name)) {
          map.set(name, [quan, price])
        } else {
          const [q, p] = map.get(name)
          map.set(name, [quan + q, price + p])
        }
      })

      const flated = Array.from(map).reduce((acc, curr) => {
        return [...acc, [curr[0], ...curr[1]]]
      }, [])

      const total = flated.reduce((acc, cur) => acc + cur[2], 0)

      setTotal(total)
      setOrders(flated)
      setBs(0)
      setOrderWasAdded(true)
    }
  }
  useEffect(() => {
    if (orderWasAdded) inputRef.current.value = ''
  }, [orderWasAdded, inputRef])

  return (
    <Button clickHandler={clickHandler} actionType='main' orientation='orizontal'>
      <MdAdd className='mr-2' size={'1.5rem'} />
      Agregar
    </Button>
  )
}

AddToCart.propTypes = {
  selected: PropTypes.array,
  rangeValue: PropTypes.number,
  orderWasAdded: PropTypes.bool,
  setOrderWasAdded: PropTypes.func,
  inputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
}

const Measure = ({ rangeValue, setRangeValue }) => {
  const [orderWasAdded, setOrderWasAdded] = useState(false)
  const inputRef = useRef(null)

  return (
    <section
      style={{ gridArea: 'Measure' }}
      className="grid grid-rows-4 gap-2 p-4 rounded-lg"
    >
      <InputRange
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
        orderWasAdded={orderWasAdded}
        setOrderWasAdded={setOrderWasAdded}
        inputRef={inputRef}
      />
      <MeasureUnits setRangeValue={setRangeValue} />
      <ShowUnit rangeValue={rangeValue} />
      <AddToCart
        rangeValue={rangeValue}
        setOrderWasAdded={setOrderWasAdded}
        inputRef={inputRef}
        orderWasAdded={orderWasAdded}
      />
    </section>
  )
}

Measure.propTypes = {
  rangeValue: PropTypes.number,
  setRangeValue: PropTypes.func.isRequired
}

export default Measure
