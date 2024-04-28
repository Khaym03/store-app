import { LiaMoneyBillWaveSolid } from 'react-icons/lia'
import { URLs } from '../../constants'
import PropTypes from 'prop-types'
import { useContext, useEffect, useState, forwardRef } from 'react'
import { MdPlaylistAddCheck } from 'react-icons/md'
import { FiUsers } from 'react-icons/fi'
import { IoMdPaper } from 'react-icons/io'
import { OweContext } from './OweProvider'
import InfoCard from '../../comp/InfoCard'
import { animated, useTransition } from '@react-spring/web'
import Button from '../../comp/Button'
import {SelectPaymentMethod} from '../sales/SalesStorager'
import Hand from './Hand'
import ClientGrid from './ClientGrid'
import DetailedClientRow from './DetailedClientRow'

const OweActionBar = ({ children }) => {
  return (
    <div className="flex flex-col mb-4">
      <h1 className="capitalize mb-2 font-bold text-2xl">area de deudas</h1>
      <ul className="rounded-lg grid grid-cols-2 w-full gap-4">{children}</ul>
    </div>
  )
}

OweActionBar.propTypes = {
  children: PropTypes.node
}

const BookHeader = () => {
  return (
    <div className="cols-2-1-1 grid mb-2 text-base text-slate-900 capitalize font-medium">
      <span className="flex justify-start items-center text-base ml-4">
        nombre del cliente
      </span>
      <span className="grid place-items-center">deuda</span>
      <span className="grid place-items-center">desde</span>
    </div>
  )
}

const TableOfDebs = ({ clientsInfo }) => {
  return (
    <div
      className={` rounded-lg book-grid grid grid-cols-1 auto-rows-[48px] h-[276px] overflow-y-auto`}
    >
      {clientsInfo &&
        clientsInfo.map(info => (
          <ClientGrid key={info[0].id} clientInfo={info} />
        ))}
    </div>
  )
}

TableOfDebs.propTypes = {
  clientsInfo: PropTypes.array
}

const OweBook = ({ children }) => {
  return (
    <section className="rounded-lg  w-full h-full">
      <h2 className="capitalize mb-2 text-xl font-bold">libro de deudores</h2>
      <BookHeader />
      {children}
    </section>
  )
}

OweBook.propTypes = {
  children: PropTypes.node
}

let DetailedClient = ({ children, clientName, anime }, ref) => {
  const { selectedClient, setSelectedClient, setTriggerUpdate, paymentMethod } =
    useContext(OweContext)
  const [toggleSelectAll, setToggleSelectAll] = useState(false)

  const selectAll = () => {
    const allCheckBoxs = ref.current.querySelectorAll('input')
    allCheckBoxs.forEach(input => (input.checked = !toggleSelectAll))
    setToggleSelectAll(!toggleSelectAll)
  }

  const updateSaleStatus = () => {
    const selected = Array.from(ref.current.querySelectorAll('input'))

    if (!(selected.length > 0 && selectedClient)) return

    const salesToBeProcessed = selected.reduce((acc, currInput, index) => {
      if (currInput.checked) return [...acc, selectedClient.owe[index]]
      return acc
    }, []).map(sale => sale.id)
    
    fetch(URLs.updateSaleStatusByIDURL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ids: salesToBeProcessed, payment_method: paymentMethod})
    }).then(res => {
      if (res.ok) {
        setTriggerUpdate(true)
        setSelectedClient(null)
        console.log(res)
      }
    })
  }

  return (
    <animated.div style={anime} className={'h-full'}>
      <h2 className="font-bold text-2xl mb-2 capitalize">{clientName}</h2>
      <p className="text-sm text-slate-700 font-medium mb-4">
        Selecciona las ventas que quieres borrar de la lista de deudas
      </p>
      <ul
        ref={ref}
        className=" mb-2 grid auto-rows-[48px] h-[284px] overflow-y-auto rounded-lg"
      >
        {children}
      </ul>
      <SelectPaymentMethod className={'mb-4'} ctx={OweContext}/>
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <Button clickHandler={selectAll}>
          <MdPlaylistAddCheck className='mr-2' size={'1.5rem'} />
          Seleccionar todo
        </Button>
        <Button clickHandler={updateSaleStatus} actionType="main">
          <IoMdPaper className='mr-2' size={'1.5rem'} />
          Pagar
        </Button>
      </div>
    </animated.div>
  )
}

DetailedClient = forwardRef(DetailedClient)

DetailedClient.propTypes = {
  children: PropTypes.node,
  clientName: PropTypes.string,
  anime: PropTypes.object
}

const OweSectionManager = () => {
  const [data, setData] = useState(null)
  const [totalDebts, setTotalDebts] = useState(0)

  const {
    selectedClient,
    detailedClientUlRef,
    triggerUpdate,
    setTriggerUpdate
  } = useContext(OweContext)

  const [activeDebtors, setActiveDebtors] = useState([])

  useEffect(() => {
    if (triggerUpdate) {
      const responses = [
        URLs.getClientsURL,
        URLs.getSalesByStatusURL('debt')
      ].map(url => fetch(url).then(res => res.json()))

      Promise.all(responses).then(info => {
        setData(info)
        setTriggerUpdate(false)
      })
    }
  }, [triggerUpdate, setTriggerUpdate])

  useEffect(() => {
    if (data) {
      const [clients, owes] = data

      setTotalDebts(owes.reduce((acc, cur) => acc + cur.price, 0))

      const clientsInfo = clients.reduce((acc, currClient) => {
        const findClientOwes = owes.filter(
          sale => sale.foreign_key === currClient.id
        )
        const hasOwes = findClientOwes.length > 0

        return hasOwes ? acc.concat([[currClient, findClientOwes]]) : acc
      }, [])

      setActiveDebtors(clientsInfo)
    }
  }, [data])

  const transition = useTransition(selectedClient ? [selectedClient] : false, {
    from: { opacity: 0 },
    enter: { opacity: 1}
  })

  return (
    <section
      id="owe-section"
      className="w-[1080px] h-[548px] grid gap-4 p-8 border-solid border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white"
    >
      <div className="flex flex-col">
        <OweActionBar>
          <InfoCard
            title={'Deuda acumulada'}
            info={totalDebts}
            color={'bg-violet-200'}
            Icon={LiaMoneyBillWaveSolid}
            currency='Bs'
          />
          <InfoCard
            title={'Clientes por pagar'}
            info={activeDebtors.length}
            color={'bg-lime-200'}
            Icon={FiUsers}
          />
        </OweActionBar>
        <OweBook>
          <TableOfDebs clientsInfo={activeDebtors} />
        </OweBook>
      </div>

      <span className="bg-gradient-to-b from-transparent via-slate-300 to-transparent rounded-full"></span>

      <div className="rounded-md relative">
        {transition((style, x) =>
          x ? (
            <DetailedClient
              anime={style}
              clientName={x.name}
              ref={detailedClientUlRef}
            >
              {x.owe.map(({ name, price, date }, i) => (
                <DetailedClientRow
                  key={i}
                  name={name}
                  price={price}
                  date={date}
                />
              ))}
            </DetailedClient>
          ) : (
            <Hand anime={style}/>
          )
        )}
      </div>
    </section>
  )
}

export default OweSectionManager
