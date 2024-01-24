import PropTypes from 'prop-types'
import './Measure.css'
import { useContext } from 'react'
import { DollarContext } from './DollarProvider'

const InputRange = ({ rangeValue, setRangeValue }) => {
  const changeHandler = e => {
    const value = Number(e.target.value)
    setRangeValue(value)
  }

  return (
    <div className="InputRangeWrapper def-border rounded transition-border-color">
      <input
        id="measure-range"
        type="range"
        min="1"
        max="1000"
        step="1"
        value={rangeValue}
        onChange={changeHandler}
      />
    </div>
  )
}

InputRange.propTypes = {
  rangeValue: PropTypes.number,
  setRangeValue: PropTypes.func.isRequired
}

const Units = ({ fraction, clickHandler }) => {
  return (
    <div
      onClick={clickHandler}
      className="Units def-border rounded bode-small transition-border-color pointer"
    >
      {fraction}
    </div>
  )
}

Units.propTypes = {
  fraction: PropTypes.string,
  clickHandler: PropTypes.func.isRequired
}

const MeasureUnits = ({ setRangeValue }) => {
  const fractions = ['1/4', '1/2', '1']

  const clickHandler = ({ target }) => {
    let fr = target.textContent
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
    <div className="MeasureUnits">
      {fractions.map((fr, i) => (
        <Units key={i} fraction={fr} clickHandler={clickHandler} />
      ))}
    </div>
  )
}

MeasureUnits.propTypes = {
  setRangeValue: PropTypes.func.isRequired
}

const ShowUnit = ({ rangeValue }) => {
  return (
    <div className="ShowUnit def-border body-large w-full h-full grid-center rounded">{`${rangeValue} ml`}</div>
  )
}

ShowUnit.propTypes = {
  rangeValue: PropTypes.number
}

const AddToCart = ({ selected, rangeValue, setTotal }) => {
  const { orders, setOrders } = useContext(DollarContext)
  const clickHandler = () => {
    if (selected.length > 0) {
      const [name, price] = selected
      const fixedPrice = Number(((rangeValue / 1000) * price).toFixed(2))
      const newOrder = [name, rangeValue, fixedPrice]

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
    }
  }

  return (
    <button
      type="submit"
      className="secondary-container on-secondary-container-text body-large capitalize"
      onClick={clickHandler}
    >
      agragar a la lista
    </button>
  )
}

AddToCart.propTypes = {
  selected: PropTypes.array,
  rangeValue: PropTypes.number,
  setTotal: PropTypes.func.isRequired
}

const Measure = ({ selected, rangeValue, setRangeValue, setTotal }) => {
  return (
    <div className="Measure row-4">
      <InputRange rangeValue={rangeValue} setRangeValue={setRangeValue} />
      <MeasureUnits setRangeValue={setRangeValue} />
      <ShowUnit rangeValue={rangeValue} />
      <AddToCart
        selected={selected}
        rangeValue={rangeValue}
        setTotal={setTotal}
      />
    </div>
  )
}

Measure.propTypes = {
  selected: PropTypes.array,
  rangeValue: PropTypes.number,
  setRangeValue: PropTypes.func.isRequired,
  setTotal: PropTypes.func.isRequired
}

export default Measure
