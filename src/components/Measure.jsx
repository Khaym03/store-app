import { useState } from 'react'
import PropTypes from 'prop-types'
import './Measure.css'

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
  return <div className='ShowUnit def-border body-large w-full h-full grid-center rounded'>{`${rangeValue} ml`}</div>
}

ShowUnit.propTypes = {
  rangeValue: PropTypes.number
}

const AddToCart = () => {
    return (<button type='submit' className="on-primary body-large">Add to cart</button>)
}

const Measure = () => {
  const [rangeValue, setRangeValue] = useState(1000)

  return (
    <div className="Measure row-4">
      <InputRange rangeValue={rangeValue} setRangeValue={setRangeValue} />
      <MeasureUnits setRangeValue={setRangeValue} />
      <ShowUnit rangeValue={rangeValue} />
      <AddToCart/>
    </div>
  )
}

export default Measure
