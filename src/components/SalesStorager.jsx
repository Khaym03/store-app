import './SalesStorager.css'
import { MdAddShoppingCart } from 'react-icons/md'
import { MdArchive } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'
import PropTypes from 'prop-types'
import { useContext } from 'react'
import { fullDate } from '../utils.js'
import { DollarContext } from './DollarProvider'

const iconSize = '1.5rem'

const GUARDAR_VENTA = 'guardar venta',
  BORRAR_VENTA = 'borrar venta'

const Total = ({ total }) => {
  return (
    <div className="Total surface-1 rounded-lg ">
      <div className="Total-icon-wrapper surface-3 grid-center rounded-lg ">
        <MdAddShoppingCart size={iconSize} />
      </div>
      <div className=" grid-center">
        <span className="Total-value italic">{total.toFixed(2)}</span>
      </div>
    </div>
  )
}

Total.propTypes = {
  total: PropTypes.number
}

const StoragerAction = ({ Icon, text, setTotal }) => {
  let bgColor, color, handler
  const { orders, setOrders } = useContext(DollarContext)

  const deleteHandler = () => {
    if (text === BORRAR_VENTA) {
      setOrders([])
      setTotal(0)
    }
  }

  // solo me queda sustetuir todos los orders

  const saveHandler = () => {
    const formatedSale = []

    if (orders && orders.length > 0) {
      orders.forEach(([name, unit, price]) => {
        const sale = {
          name,
          price,
          unit,
          type: 'cleaning',
          date: fullDate()
        }

        formatedSale.push(sale)
      })
    }

    formatedSale.forEach(sale => {
      fetch('http://localhost:1234/postSale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sale) // body data type must match "Content-Type" header
      })
    })

    setOrders([])
  }

  if (text === BORRAR_VENTA) {
    bgColor = 'error'
    color = 'error-container-text'
    handler = deleteHandler
  } else if (text === GUARDAR_VENTA) {
    bgColor = 'tertiary-container'
    color = 'on-tertiary-container-text'
    handler = saveHandler
  }

  return (
    <div
      className={`StoragerActionBtns Total rounded-lg ${bgColor} ${color}`}
      onClick={handler}
    >
      <span className="Total-icon-wrapper grid-center rounded-lg">
        <Icon size={'1.5rem'} />
      </span>
      <span className="grid-center capitalize">{text}</span>
    </div>
  )
}

StoragerAction.propTypes = {
  Icon: PropTypes.func.isRequired,
  text: PropTypes.string,
  setTotal: PropTypes.func
}

const SalesStorager = ({ total, setTotal }) => {
  return (
    <section className="SalesStorager def-border rounded ">
      <div className="Storager-actions">
        <Total total={total} />
        <div className="action-bar full">
          <StoragerAction Icon={MdArchive} text={GUARDAR_VENTA} />

          <StoragerAction
            Icon={MdDeleteForever}
            text={BORRAR_VENTA}
            setTotal={setTotal}
          />
        </div>
      </div>
      <div className="surface-3"></div>
    </section>
  )
}

SalesStorager.propTypes = {
  total: PropTypes.number,
  setTotal: PropTypes.func.isRequired
}

export default SalesStorager
