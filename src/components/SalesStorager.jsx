import { MdAddShoppingCart } from 'react-icons/md'
import { MdOutlineArchive } from "react-icons/md"
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

const iconSize = '2.5rem'

const SAVE_SALE = 'guardar',
  DELETE_SALE = 'borrar'

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

const StoragerAction = ({ Icon, text }) => {
  let bgColor, color, handler, hover
  const { orders, setOrders, setTotal, setShowSaveNotification } =
    useContext(DollarContext)

  const { setUpdateNavInfo } = useContext(SectionSliderContext)

  const deleteHandler = () => {
    setOrders([])
    setTotal(0)
  }

  const saveHandler = () => {
    postSales(salesFormater(orders))
    setOrders([])
    setTotal(0)
    setShowSaveNotification(true)
    setUpdateNavInfo(true)
  }

  if (text === DELETE_SALE) {
    bgColor = 'bg-red-100'
    color = 'text-red-700'
    hover = 'hover:bg-red-200'
    handler = deleteHandler
  } else if (text === SAVE_SALE) {
    bgColor = 'bg-blue-100'
    color = 'text-sky-700'
    hover = 'hover:bg-blue-200'
    handler = saveHandler
  }

  return (
    <button
      className={`grid place-items-center rounded-lg ${bgColor} ${color} ${hover} transition-colors`}
      onClick={handler}
    >
      <div className="flex-col">
        <span className="grid place-items-center rounded-lg mb-4">
          <Icon size={iconSize} />
        </span>
        <span className="grid place-items-center capitalize text-md">
          {text}
        </span>
      </div>
    </button>
  )
}

StoragerAction.propTypes = {
  Icon: PropTypes.func.isRequired,
  text: PropTypes.string
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
  const { orders, setOrders, setTotal, setShowSaveNotification } =
    useContext(DollarContext)

  const { setUpdateNavInfo } = useContext(SectionSliderContext)

  const clickHandler = clientId => {
    postSales(salesFormater(orders, clientId))
    setOrders([])
    setTotal(0)
    setUpdateNavInfo(true)
    setShowSaveNotification(true)
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
      <button
        className="flex justify-center items-center bg-blue-100 hover:bg-blue-200 text-sky-700 rounded-lg h-full transition-colors"
        onClick={popup}
      >
        <MdOutlineAddReaction size={'1.5rem'} />
      </button>

      <dialog
        ref={dialogRef}
        className=" w-72 h-48 absolute inset-2/4 -translate-y-2/4 -translate-x-2/4 border-solid border-2 border-slate-100 shadow-lg rounded-lg background"
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
              className="border-solid border-2 border-slate-100 rounded-lg transition-colors hover:bg-slate-100 capitalize"
            >
              cancel
            </button>
            <button
              onClick={addClient}
              className="hover:bg-blue-200 transition-colors rounded-lg bg-blue-100 text-sky-700 capitalize"
            >
              añadir
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

ClientDialog.propTypes = {
  setUpdateClientList: PropTypes.func
}

const SalesStorager = () => {
  const [clients, setClients] = useState(null)
  const { total, searchingClient, updateClientList, setUpdateClientList } =
    useContext(DollarContext)

  const transitions = useTransition(clients || [], {
    from: { opacity: 0, display: 'block' },
    enter: { opacity: 1 },
    leave: { opacity: 0, display: 'none' },
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
      <div className="grid gap-4 grid-rows-2 p-4">
        <Total total={total} />
        <div className="grid grid-cols-2 gap-4">
          <StoragerAction Icon={MdDeleteOutline} text={DELETE_SALE} />
          <StoragerAction Icon={MdOutlineArchive } text={SAVE_SALE} />
        </div>
      </div>
      <section className="flex flex-col p-4">
        <div className="h-[52.4px] relative justify-between rounded-lg flex mb-2">
          <SearchBar />
          <ClientDialog setUpdateClientList={setUpdateClientList} />
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
