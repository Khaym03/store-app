import PropTypes from 'prop-types'
import { useContext, useEffect, useRef, useState } from 'react'
import { ManagerContext } from './Manager'
import { MdAdd } from 'react-icons/md'
import Button from '../../comp/Button'
import Input from '../../comp/Input'

const calcMls = (x, price) => x / price

const Converter = ({ setRangeValue }) => {
  const { bsConverterRef, setBs, selected } = useContext(ManagerContext)

  const handleChange = () => {
    if (!selected) {
      bsConverterRef.current.value = ''
      return
    }

    const price = selected[1]
    const value = +bsConverterRef.current.value,
      ml = calcMls(value, price) * 1000

    setBs(value)
    setRangeValue(ml)
  }

  return (
    <Input placeholder="bs" changeHandler={handleChange} ref={bsConverterRef} />
  )
}

Converter.propTypes = {
  setRangeValue: PropTypes.func
}

const InputRange = ({ setRangeValue, inputRef }) => {
  const changeHandler = () => {
    const value = +inputRef.current.value
    if (Number.isNaN(value)) return

    setRangeValue(value)
  }

  return (
    <div className="rounded-lg gap-2 grid grid-cols-2 place-items-center relative transition-colors mb-4">
      <Input
        placeholder="Ingrese los ml"
        ref={inputRef}
        changeHandler={changeHandler}
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
    <div className="MeasureUnits grid grid-cols-3 gap-2 mb-4">
      <Button clickHandler={clickHandler} actionType="main" data-fraction="1/4">
        1/4
      </Button>
      <Button clickHandler={clickHandler} actionType="main" data-fraction="1/2">
        1/2
      </Button>
      <Button clickHandler={clickHandler} actionType="main" data-fraction="1">
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
    <div className="border-slate-200 border text-base font-medium w-full h-12 grid place-items-center rounded-lg italic mb-4 shadow-sm">{`${parseInt(
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
  const {
    orders,
    setOrders,
    setTotal,
    bs,
    setBs,
    selected,
    triggerProcessOrders,
    setProcessedOrders,
    bsConverterRef
  } = useContext(ManagerContext)

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

  const mergeOrders = orders => {
    return orders.reduce((map, [name, quan, price]) => {
      if (!map.has(name)) {
        return map.set(name, [quan, price])
      } else {
        const [q, p] = map.get(name)
        return map.set(name, [quan + q, price + p])
      }
    }, new Map())
  }

  const processOrders = () => {
    let map

    if (selected) {
      const newOrder = formattedOrder()
      const merged = [...orders, newOrder]

      map = mergeOrders(merged)
    } else {
      map = mergeOrders(orders)
    }

    const flated = Array.from(map).reduce((acc, curr) => {
      return [...acc, [curr[0], ...curr[1]]]
    }, [])

    const total = flated.reduce((acc, cur) => acc + cur[2], 0)

    setTotal(total)
    setOrders(flated)
    setProcessedOrders(flated)
    setBs(0)
    setOrderWasAdded(false)
  }
  const clickHandler = () => {
    if (selected) {
      processOrders()
      setOrderWasAdded(true)
    }
  }
  useEffect(() => {
    inputRef.current.value = ''
    bsConverterRef.current.value = ''
  }, [orderWasAdded])

  useEffect(() => {
    processOrders()
  }, [triggerProcessOrders])

  return (
    <Button clickHandler={clickHandler} actionType="main">
      <MdAdd className="mr-2" size={'1.5rem'} />
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

const Measure = () => {
  const { rangeValue, setRangeValue } = useContext(ManagerContext)
  const [orderWasAdded, setOrderWasAdded] = useState(false)
  const inputRef = useRef(null)

  return (
    <section className="flex flex-col p-4 w-full">
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

export default Measure
