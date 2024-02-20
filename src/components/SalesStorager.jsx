import { MdAddShoppingCart } from 'react-icons/md'
import { MdArchive } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'
import PropTypes from 'prop-types'
import { useContext, useRef } from 'react'
import { salesFormater, postSales, postClient } from '../utils.js'
import { DollarContext } from './DollarProvider'
import { MdOutlineAddReaction } from 'react-icons/md'
import { MdAccountCircle } from 'react-icons/md'
import { MdAdd } from 'react-icons/md'
import { FetchTable } from '../hooks/FetchTable.jsx'
import { useTransition, animated } from '@react-spring/web'
import { URLs } from '../constants.js'
import { SectionSliderContext } from './SectionSliderProvider.jsx'

const iconSize = '2.5rem'

const SAVE_SALE = 'guardar',
  DELETE_SALE = 'borrar'

const Total = ({ total }) => {
  return (
    <div className="flex flex-col justify-center surface-variant on-surface-variant-text rounded-lg p-4">
      <header className="text-center capitalize text-sm font-bold">
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

const StoragerAction = ({ Icon, text }) => {
  let bgColor, color, handler
  const { orders, setOrders, setTotal, setShowSaveNotification } =
    useContext(DollarContext)

  const { setSaveButtonWasClicked } = useContext(SectionSliderContext)

  const deleteHandler = () => {
    setOrders([])
    setTotal(0)
  }

  const saveHandler = () => {
    postSales(salesFormater(orders))
    setOrders([])
    setTotal(0)
    setShowSaveNotification(true)
    setSaveButtonWasClicked(true)
  }

  if (text === DELETE_SALE) {
    bgColor = 'error-container'
    color = 'on-error-container-text'
    handler = deleteHandler
  } else if (text === SAVE_SALE) {
    bgColor = 'secondary-container'
    color = 'on-secondary-container-text'
    handler = saveHandler
  }

  return (
    <button
      className={`grid place-items-center rounded-lg ${bgColor} ${color}`}
      onClick={handler}
    >
      <div className="flex-col">
        <span className="grid place-items-center rounded-lg mb-4">
          <Icon size={iconSize} />
        </span>
        <span className="grid place-items-center capitalize">{text}</span>
      </div>
    </button>
  )
}

StoragerAction.propTypes = {
  Icon: PropTypes.func.isRequired,
  text: PropTypes.string
}

const SearchBar = () => {
  const { setSearchingClient } = useContext(DollarContext)

  const changeHandler = e => {
    setSearchingClient(e.currentTarget.value.toLowerCase())
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
  const { orders, setOrders, setTotal, setShowSaveNotification } =
    useContext(DollarContext)
  const clickHandler = e => {
    const clientId = Number(e.target.dataset.clientid)

    postSales(salesFormater(orders, clientId))
    setOrders([])
    setTotal(0)
    setShowSaveNotification(true)
  }

  return (
    <div
      className="justify-between bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm client-row rounded-lg flex cursor-pointer w-full h-full"
      data-clientid={clientId}
      onClick={clickHandler}
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

const ClientDialog = () => {
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
      dialogRef.close()
    }
  }

  return (
    <div>
      <button
        className="flex justify-center items-center tertiary-container on-tertiary-container-text rounded-lg h-full"
        onClick={popup}
      >
        <MdOutlineAddReaction size={'1.5rem'} />
      </button>

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
            <button
              onClick={close}
              className="rounded-lg transition-colors hover:bg-slate-100"
            >
              cancel
            </button>
            <button
              onClick={addClient}
              className="hover:bg-sky-300 transition-colors rounded-lg secondary-container on-secondary-container-text"
            >
              añadir
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

const SalesStorager = () => {
  const { total, searchingClient } = useContext(DollarContext)
  const { data } = FetchTable(URLs.getClientsURL)

  const clients = data
    ? data.filter(client => {
        const letters = client.name
          .slice(0, searchingClient.length)
          .toLowerCase()

        return letters === searchingClient
      })
    : []

  const transitions = useTransition(clients, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    keys: item => item.name // Use the product name as the key
  })

  return (
    <section style={{gridArea:' Client'}} className=" grid-cols-2 grid gap-4 rounded-lg">
      <div className="grid gap-4 grid-rows-2 p-4">
        <Total total={total} />
        <div className="grid grid-cols-2 gap-4">
          <StoragerAction Icon={MdDeleteForever} text={DELETE_SALE} />
          <StoragerAction Icon={MdArchive} text={SAVE_SALE} />
        </div>
      </div>
      <section className="flex flex-col p-4">
      <div className="h-[52.4px] relative justify-between rounded-lg flex mb-2">
            <SearchBar />
            <ClientDialog />
          </div>
        <ul
          className={`grid max-h-[241.6px] gap-2 overflow-y-auto auto-rows-[52.4px] h-full  text-slate-700`}
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
