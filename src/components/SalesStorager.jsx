import './SalesStorager.css'
import { MdAddShoppingCart } from 'react-icons/md'
import { MdArchive } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'
import PropTypes from 'prop-types'
import { useContext } from 'react'
import { salesFormater, postSales, postClient } from '../utils.js'
import { DollarContext } from './DollarProvider'
import { MdOutlineAddReaction } from 'react-icons/md'
import { MdAccountCircle } from 'react-icons/md'
import { MdAdd } from 'react-icons/md'
import { FetchTable } from '../hooks/FetchTable.jsx'
import { useTransition, animated } from '@react-spring/web'
import { URLs } from '../constants.js'
import {SectionSliderContext} from './SectionSliderProvider.jsx'

const iconSize = '2.5rem'

const SAVE_SALE = 'guardar',
  DELETE_SALE = 'borrar'

const Total = ({ total }) => {
  return (
    <div className="Total surface-variant on-surface-variant-text rounded-lg p-4">
      <header className='text-align-center capitalize text-sm bold'>total a pagar</header>
      <div className='grid-col-2 full'>
        <div className="Total-icon-wrapper grid-center rounded-lg ">
          <MdAddShoppingCart size={iconSize} />
        </div>
        <div className=" grid-center">
          <animated.span className="Total-value italic display-small">
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

  const {setSaveButtonWasClicked} = useContext(SectionSliderContext)

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
    <div
      className={`StoragerActionBtns grid-center rounded-lg ${bgColor} ${color}`}
      onClick={handler}
    >
      <div className="flex-col">
        <span className="Total-icon-wrapper grid-center rounded-lg mb-1">
          <Icon size={iconSize} />
        </span>
        <span className="grid-center capitalize">{text}</span>
      </div>
    </div>
  )
}

StoragerAction.propTypes = {
  Icon: PropTypes.func.isRequired,
  text: PropTypes.string
}

const SearchBar = () => {
  const { setSearchingClient } = useContext(DollarContext)

  const changeHandler = e => {
    setSearchingClient(e.target.value.toLowerCase())
  }

  return (
    <div className="">
      <input
        className="body-large rounded def-border"
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
      className="client-card surface-variant client-row rounded flex pointer-events-none cursor-pointer full"
      data-clientid={clientId}
      onClick={clickHandler}
    >
      <span className="flex">
        <span className="grid-center ml-1">
          <MdAccountCircle size={'1.5rem'} />
        </span>

        <span className="label-large grid-center ml-1">{name}</span>
      </span>
      <span className="grid-center mr-1">
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
  const dialog = document.querySelector('.client-dialog')
  const { data } = FetchTable(URLs.getClientsURL)

  const popup = () => dialog.showModal()

  const close = () => dialog.close()

  const addClient = () => {
    const input = dialog.querySelector('input')

    const name = input.value.toLowerCase()

    const alreadyExist = data.find(client => name === client.name.toLowerCase())

    if (alreadyExist) {
      input.value = ''
      input.placeholder = 'Ese Nombre ya existe'
    } else {
      input.value = ''
      input.placeholder = 'Ingre el Nombre'
      postClient(name)
      dialog.close()
    }
  }

  return (
    <div>
      <button
        className="flex-center  tertiary-container on-tertiary-container-text rounded"
        onClick={popup}
      >
        <MdOutlineAddReaction size={'1.5rem'} />
      </button>

      <dialog className="client-dialog def-border box-shadow rounded-lg">
        <div className="wrapper full p-4">
          <div className="relative">
            <input
              className="body-large def-border rounded-lg"
              type="text"
              placeholder="Ingrese el Nombre"
            />
          </div>
          <div className="grid-col-2 gap-1">
            <button onClick={close} className="rounded-lg">
              cancel
            </button>
            <button
              onClick={addClient}
              className="rounded-lg secondary-container on-secondary-container-text"
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
    <section className="SalesStorager rounded-lg">
      <div className="Storager-actions p-4">
        <Total total={total} />
        <div className="action-bar full">
          <StoragerAction Icon={MdDeleteForever} text={DELETE_SALE} />
          <StoragerAction Icon={MdArchive} text={SAVE_SALE} />
        </div>
      </div>
      <section className="p-4 client-search-section">
        <div className="search-bar-wrapper rounded-lg flex">
          <SearchBar />
          <ClientDialog />
        </div>
        <ul>
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
