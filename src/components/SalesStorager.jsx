import { MdAddShoppingCart } from 'react-icons/md'
import { MdOutlineArchive } from 'react-icons/md'
import { MdDeleteOutline } from 'react-icons/md'
import PropTypes from 'prop-types'
import { useContext, useEffect, useRef, useState } from 'react'
import { salesFormater, postSales, postClient } from '../utils.ts'
import { DollarContext } from './DollarProvider'
import { MdOutlineAddReaction } from 'react-icons/md'
import { MdAccountCircle } from 'react-icons/md'
import { MdAdd } from 'react-icons/md'
import { FetchTable } from '../hooks/FetchTable.jsx'
import { useTransition, animated } from '@react-spring/web'
import { URLs } from '../constants.ts'
import { SectionSliderContext } from './SectionSliderProvider.jsx'
import { MdOutlineFingerprint } from 'react-icons/md'
import { MdOutlineCreditCard } from 'react-icons/md'
import { GiMoneyStack } from 'react-icons/gi'
import { MdOutlineMessage } from 'react-icons/md'
import PaymentMethodItem from '../comp/SelectPaymentMethod.tsx'
import Button from '../comp/Button.tsx'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

const iconSize = '2.5rem'

const Total = ({ total }) => {
  return (
    <div className="flex flex-col justify-center bg-slate-100 text-slate-700 rounded-lg p-4">
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


const SearchBar = () => {
  const { setSearchingClient, setUpdateClientList } = useContext(DollarContext)

  const changeHandler = e => {
    setSearchingClient(e.currentTarget.value.toLowerCase())
    setUpdateClientList(true)
  }

  return (
    <div className="">
      <input
        className="text-sm font-medium h-full absolute pl-4 w-4/5 rounded-lg shadow-sm border-solid border-2 border-slate-100"
        type="text"
        placeholder="Buscar Cliente"
        onInput={changeHandler}
      />
    </div>
  )
}

const ClientCard = ({ name, clientId }) => {
  const { orders, setOrders, setTotal, setNotification } =
    useContext(DollarContext)

  const { setUpdateNavInfo } = useContext(SectionSliderContext)

  const notificationConfig = {
    message: 'Guardado Correctamente',
    show: true,
    setShow: setNotification,
    Icon: IoMdCheckmarkCircleOutline
  }

  const clickHandler = clientId => {
    postSales(salesFormater(orders, clientId))
    setOrders([])
    setTotal(0)
    setUpdateNavInfo(true)
    setNotification(notificationConfig)
  }

  return (
    <div
      className="justify-between bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm client-row rounded-lg flex cursor-pointer w-full h-full"
      data-clientid={clientId}
      onClick={() => clickHandler(clientId)}
    >
      <span className="flex">
        <span className="grid place-items-center ml-4">
          <MdAccountCircle size={'1.5rem'} />
        </span>

        <span className="capitalize text-sm font-medium grid place-items-center ml-4">
          {name}
        </span>
      </span>
      <span className="grid place-items-center mr-4">
        <MdAdd size={'1.5rem'} />
      </span>
    </div>
  )
}

ClientCard.propTypes = {
  name: PropTypes.string,
  clientId: PropTypes.number
}

const ClientDialog = ({ setUpdateClientList }) => {
  const { data } = FetchTable(URLs.getClientsURL)

  const dialogRef = useRef(null),
    inputRef = useRef(null)

  const popup = () => dialogRef.current.showModal(),
    close = () => dialogRef.current.close()

  const addClient = () => {
    const name = inputRef.current.value.toLowerCase()

    const alreadyExist = data.find(client => name === client.name.toLowerCase())

    if (alreadyExist) {
      inputRef.current.value = ''
      inputRef.current.placeholder = 'Ese Nombre ya existe'
    } else {
      inputRef.current.value = ''
      inputRef.current.placeholder = 'Ingre el Nombre'
      postClient(name)
      dialogRef.current.close()
      setUpdateClientList(true)
    }
  }

  return (
    <div>
      <Button clickHandler={popup} actionType='main'>
        <MdOutlineAddReaction size={'1.5rem'} />
      </Button>

      <dialog
        ref={dialogRef}
        className=" w-72 h-48 absolute inset-2/4 -translate-y-2/4 -translate-x-2/4 border-solid border-2 border-slate-100 shadow-lg rounded-lg"
      >
        <div className="grid grid-rows-2 gap-4 w-full h-full p-4">
          <div className="relative">
            <input
              className="text-sm font-medium w-full text-center shadow-sm border-solid border-2 border-slate-100 rounded-lg h-full absolute"
              type="text"
              placeholder="Ingrese el Nombre"
              ref={inputRef}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button clickHandler={close}>Cancel</Button>
            <Button clickHandler={addClient} actionType='main'>Añadir</Button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

ClientDialog.propTypes = {
  setUpdateClientList: PropTypes.func
}

export const SelectPaymentMethod = ({ctx,className}) => {
  const { paymentMethod, setPaymentMethod } = useContext(ctx)
  const methods = [
    { name: 'bio', icon: MdOutlineFingerprint },
    { name: 'punto', icon: MdOutlineCreditCard },
    { name: 'efectivo', icon: GiMoneyStack },
    { name: 'pago-movil', icon: MdOutlineMessage }
  ]

  return (
    <ul className={`grid grid-cols-4 bg-slate-50 rounded-lg ${className}`}>
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
    setPaymentMethod: PropTypes.func,
 }).isRequired,
 className: PropTypes.string
}

const SalesStorager = () => {
  const [clients, setClients] = useState(null)
  const {
    total,
    searchingClient,
    updateClientList,
    setUpdateClientList,
    orders,
    setOrders,
    setTotal,
    setNotification,
    paymentMethod
  } = useContext(DollarContext)

  const { setUpdateNavInfo } = useContext(SectionSliderContext)

  const deleteHandler = () => {
    setOrders([])
    setTotal(0)
  }

  const notificationConfig = {
    message: 'Guardado Correctamente',
    show: true,
    setShow: setNotification,
    Icon: IoMdCheckmarkCircleOutline
  }

  const saveHandler = () => {
    postSales(salesFormater(orders, null, paymentMethod))
    setOrders([])
    setTotal(0)
    setNotification(notificationConfig)
    setUpdateNavInfo(true)
  }

  const transitions = useTransition(clients || [], {
    from: { opacity: 0, display: 'none' },
    enter: { opacity: 1, display: 'block' },
    config: { duration: 40 },
    trail: 20,
    keys: item => item.name // Use the product name as the key
  })

  useEffect(() => {
    if (updateClientList) {
      fetch(URLs.getClientsURL)
        .then(res => res.json())
        .then(data => {
          const filteredClients = data
            ? data.filter(client => {
                const letters = client.name
                  .slice(0, searchingClient.length)
                  .toLowerCase()

                return letters === searchingClient
              })
            : []
          setClients(filteredClients)
          setUpdateClientList(false)
        })
    }
  }, [searchingClient, updateClientList, setUpdateClientList])

  return (
    <section
      style={{ gridArea: ' Client' }}
      className=" grid-cols-2 grid gap-4 rounded-lg"
    >
      <div className="grid gap-4 rows-2-1-1 p-4 overflow-hidden">
        <Total total={total} />
        <SelectPaymentMethod ctx={DollarContext}/>
        <div className="grid grid-cols-2 gap-4">
          <Button clickHandler={deleteHandler} actionType='delete'>
            <MdDeleteOutline size={'1.5rem'} className='mr-2'/>
            Borrar
          </Button>
          <Button clickHandler={saveHandler} actionType='main'>
            <MdOutlineArchive size={'1.5rem'} className='mr-2'/>
            Guardar
          </Button>
        </div>
      </div>
      <section className="flex flex-col p-4">
        <div className="h-[52.4px] relative justify-between rounded-lg flex mb-2 overflow-hidden">
          <SearchBar />
          <ClientDialog setUpdateClientList={setUpdateClientList} />
        </div>
        <ul
          className={`grid max-h-[241.6px] gap-2 overflow-y-auto auto-rows-[54px] h-[241.6px]  text-slate-700`}
        >
          {transitions(
            (styles, client) =>
              client && (
                <animated.li style={styles}>
                  <ClientCard name={client.name} clientId={client.id} />
                </animated.li>
              )
          )}
        </ul>
      </section>
    </section>
  )
}

export default SalesStorager
