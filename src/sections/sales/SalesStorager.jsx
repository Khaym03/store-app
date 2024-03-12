import { MdAddShoppingCart } from 'react-icons/md'
import { MdOutlineArchive } from 'react-icons/md'
import { MdDeleteOutline } from 'react-icons/md'
import PropTypes from 'prop-types'
import { useContext } from 'react'
import { salesFormater, postSales } from '../../utils.ts'
import { ManagerContext } from './Manager.jsx'
import { SectionSliderContext } from '../../components/SectionSliderProvider.jsx'
import { MdOutlineFingerprint } from 'react-icons/md'
import { MdOutlineCreditCard } from 'react-icons/md'
import { GiMoneyStack } from 'react-icons/gi'
import { MdOutlineMessage } from 'react-icons/md'
import PaymentMethodItem from '../../comp/SelectPaymentMethod.tsx'
import Button from '../../comp/Button.tsx'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { animated } from '@react-spring/web'

const iconSize = '2.5rem'

const Total = ({ total }) => {
  return (
    <div className="h-28 flex flex-col justify-center border border-slate-200 text-slate-700 rounded-lg p-4 mb-4 shadow-sm">
      <header className="text-center capitalize text-sm font-medium">
        total a pagar
      </header>
      <div className="grid grid-cols-2 w-full h-full">
        <div className="grid place-items-center rounded-lg ">
          <MdAddShoppingCart size={iconSize} />
        </div>
        <div className="grid place-items-center">
          <animated.span className="text-3xl font-medium italic">
            {Number(total.toFixed(2)).toLocaleString('en-US')}
          </animated.span>
        </div>
      </div>
    </div>
  )
}

Total.propTypes = {
  total: PropTypes.number
}

export const SelectPaymentMethod = ({ ctx, className }) => {
  const { paymentMethod, setPaymentMethod } = useContext(ctx)
  const methods = [
    { name: 'bio', icon: MdOutlineFingerprint },
    { name: 'punto', icon: MdOutlineCreditCard },
    { name: 'efectivo', icon: GiMoneyStack },
    { name: 'pago-movil', icon: MdOutlineMessage }
  ]
  
  return (
    <ul className={`grid grid-cols-4 rounded-md border border-slate-200 shadow-sm ${className ?? ''}`}>
      {methods.map(method => (
        <PaymentMethodItem
          key={method.name}
          name={method.name}
          Icon={method.icon}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      ))}
    </ul>
  )
}

SelectPaymentMethod.propTypes = {
  ctx: PropTypes.shape({
    paymentMethod: PropTypes.string,
    setPaymentMethod: PropTypes.func
  }).isRequired,
  className: PropTypes.string
}

const SalesStorager = () => {
  const { total, orders, setOrders, setTotal, setNotification, paymentMethod,setProcessedOrders } =
    useContext(ManagerContext)

  const { setUpdateNavInfo } = useContext(SectionSliderContext)

  const deleteHandler = () => {
    setOrders([])
    setProcessedOrders(null)
    setTotal(0)
  }

  const notificationConfig = {
    message: 'Guardado Correctamente',
    show: true,
    setShow: setNotification,
    Icon: IoMdCheckmarkCircleOutline,
    type: 'success'
  }

  const saveHandler = () => {
    if(!(orders.length > 0)) return
    postSales(salesFormater(orders, null, paymentMethod))
    setOrders([])
    setProcessedOrders(null)
    setTotal(0)
    setNotification(notificationConfig)
    setUpdateNavInfo(true)
  }

  return (
    <section className="flex flex-col p-4 overflow-hidden w-full">
      <Total total={total} />
      <SelectPaymentMethod ctx={ManagerContext} className={'mb-4'} />
      <div className="grid grid-cols-2 gap-4">
        <Button clickHandler={deleteHandler} actionType="delete">
          <MdDeleteOutline size={'1.5rem'} className="mr-2" />
          Borrar
        </Button>
        <Button clickHandler={saveHandler} actionType="main">
          <MdOutlineArchive size={'1.5rem'} className="mr-2" />
          Guardar
        </Button>
      </div>
    </section>
  )
}

export default SalesStorager
