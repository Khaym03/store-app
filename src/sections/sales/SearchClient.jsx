import { useContext, useEffect, useState } from 'react'
import { ManagerContext } from './Manager'
import { URLs } from '../../constants'
import { useTransition, animated } from '@react-spring/web'
import Input from '../../comp/Input'
import ClientDialog from './ClientDialog'
import PropTypes from 'prop-types'
import { FiUser } from 'react-icons/fi'
import { MdAdd } from 'react-icons/md'
import { SectionSliderContext } from '../../components/SectionSliderProvider'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { postSales, salesFormater } from '../../utils'

const SearchBar = () => {
  const { setSearchingClient, setUpdateClientList } = useContext(ManagerContext)

  const changeHandler = e => {
    setSearchingClient(e.currentTarget.value.toLowerCase())
    setUpdateClientList(true)
  }

  return <Input placeholder="Buscar clienter" changeHandler={changeHandler} />
}

const ClientCard = ({ name, clientId }) => {
  const { orders, setOrders, setTotal, setNotification, setProcessedOrders } =
    useContext(ManagerContext)

  const { setUpdateNavInfo } = useContext(SectionSliderContext)

  const success = {
    message: 'Guardado Correctamente',
    show: true,
    setShow: setNotification,
    type: 'success',
    Icon: IoMdCheckmarkCircleOutline
  }

  const fail = {
    message: 'No hay orden que agregar',
    show: true,
    setShow: setNotification,
    type:'error'
  }

  const clickHandler = clientId => {
    if (orders.length > 0) {
      postSales(salesFormater(orders, clientId))
      setOrders([])
      setProcessedOrders(null)
      setTotal(0)
      setUpdateNavInfo(true)
      setNotification(success)
    } else {
      setNotification(fail)
    }
  }

  return (
    <div
      className="justify-between hover:bg-slate-100 transition-colors rounded-lg flex cursor-pointer w-full h-full"
      data-clientid={clientId}
      onClick={() => clickHandler(clientId)}
    >
      <span className="flex">
        <span className="grid place-items-center ml-4">
          <FiUser size={'1.5rem'} />
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

const SearchClient = () => {
  const { searchingClient, updateClientList, setUpdateClientList } =
    useContext(ManagerContext)
  const [clients, setClients] = useState(null)
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
    <section className="flex flex-col p-4 row-span-3 border-l border-slate-200">
      <div className="flex flex-row relative rounded-lg mb-2">
        <SearchBar />
      </div>
      <ul
        className={`grid gap-2 overflow-y-auto auto-rows-[48px] h-[608px] text-slate-700 mb-2`}
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
      <ClientDialog setUpdateClientList={setUpdateClientList} />
    </section>
  )
}

export default SearchClient
