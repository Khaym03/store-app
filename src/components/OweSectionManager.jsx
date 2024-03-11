import { FiUser } from 'react-icons/fi'
import { LiaMoneyBillWaveSolid } from 'react-icons/lia'
import { URLs } from '../constants'
import PropTypes from 'prop-types'
import { useContext, useEffect, useState, forwardRef } from 'react'
import { MdPlaylistAddCheck } from 'react-icons/md'
import { FiUsers } from 'react-icons/fi'
import { IoMdPaper } from 'react-icons/io'
import { OweContext } from './OweProvider'
import InfoCard from '../comp/InfoCard'
import { useSpring, animated, useTransition } from '@react-spring/web'
import Button from '../comp/Button'
import {SelectPaymentMethod} from '../sections/sales/SalesStorager'

const Hand = ({anime}) => {
  const range = 5
  const pointing = useSpring({
    from: { x: -range },
    to: [{ x: range }, { x: -range }],
    loop: true
  })

  return (
    <animated.div style={anime} className="p-8 h-full flex justify-center flex-col items-center">
      <h1 className="font-black text-3xl text-center capitalize mb-4">
        Seleciona un cliente
      </h1>
      <p className="text-center font-medium text-lg text-slate-700 mb-4">
        para ver los detalles de la dueda
      </p>
      <div className="p-8 rounded-lg w-48">
        <animated.img src="/Hands.webp" style={pointing} />
      </div>
    </animated.div>
  )
}

Hand.propTypes = {
  anime: PropTypes.object
}

const OweActionBar = ({ children }) => {
  return (
    <div className="flex flex-col mb-4">
      <h1 className="capitalize mb-4 font-bold text-2xl">area de deudas</h1>
      <ul className="rounded-lg grid grid-cols-2 w-full gap-4">{children}</ul>
    </div>
  )
}

OweActionBar.propTypes = {
  children: PropTypes.node
}

const ClientGrid = ({ clientInfo }) => {
  const { setSelectedClient } = useContext(OweContext)
  const clientName = clientInfo[0].name
  const clientOwe = clientInfo[1].reduce((acc, curr) => acc + curr.price, 0)
  const since = clientInfo[1][0].date

  const clickHandler = () => {
    const info = {
      name: clientName,
      since,
      owe: clientInfo[1]
    }

    setSelectedClient(info)
  }

  return (
    <div
      onClick={clickHandler}
      data-client_id={clientInfo[0].id}
      className="cols-2-1-1 grid font-medium text-base capitalize cursor-pointer border-t border-slate-100 hover:bg-slate-100 text-slate-700 transition-colors"
    >
      <div className="flex justify-start items-center ml-4">
        <span className=" w-10 h-10 on-surface-variant-text rounded-lg mr-4 grid place-items-center">
          <FiUser size={'2rem'} />
        </span>
        <span>{clientName}</span>
      </div>
      <span className="grid place-items-center italic">
        {clientOwe.toFixed(2)}
      </span>
      <span className="grid place-items-center">{since}</span>
    </div>
  )
}

ClientGrid.propTypes = {
  clientInfo: PropTypes.array
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
      className={` rounded-lg book-grid grid grid-cols-1 auto-rows-[68px] h-[276px] overflow-y-auto`}
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
      <h2 className="capitalize mb-4 text-xl font-bold">libro de deudores</h2>
      <BookHeader />
      {children}
    </section>
  )
}

OweBook.propTypes = {
  children: PropTypes.node
}

const DetailedClientRow = ({ name, price, date }) => {
  const clickhander = ({ currentTarget }) => {
    const checkBox = currentTarget.querySelector('input')
    checkBox.checked = !checkBox.checked
  }

  return (
    <li
      className="DetailedClientRow grid border-t-2 border-slate-50 hover:bg-slate-100 cursor-pointer "
      onClick={clickhander}
    >
      <span className="grid place-items-center">
        <input
          className="w-6 h-6 pointer-events-none"
          type="checkbox"
          name={name}
          defaultChecked={false}
        />
      </span>
      <span className="flex justify-start items-center capitalize text-sm font-medium">
        {name}
      </span>
      <span className="grid place-items-center text-sm font-medium italic">
        {price}
      </span>
      <span className="grid place-items-center">{date}</span>
    </li>
  )
}

DetailedClientRow.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
  date: PropTypes.string
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
      <p className="text-sm text-slate-700 font-medium mb-2">
        Selecciona las ventas que quieres borrar de la lista de deudas
      </p>
      <ul
        ref={ref}
        className=" mb-2 grid auto-rows-[40px] h-[240px] overflow-y-auto rounded-lg"
      >
        {children}
      </ul>
      <SelectPaymentMethod className={'mb-4'} ctx={OweContext}/>
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <Button clickHandler={selectAll}>
          <MdPlaylistAddCheck size={'1.5rem'} />
          Seleccionar todo
        </Button>
        <Button clickHandler={updateSaleStatus} actionType="main">
          <IoMdPaper size={'1.5rem'} />
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
      className="w-[1080px] h-[572px] grid gap-8 p-8 border-solid border border-slate-200 shadow-sm rounded-xl"
    >
      <div className="flex flex-col">
        <OweActionBar>
          <InfoCard
            title={'Deuda Total'}
            info={totalDebts}
            color={'bg-violet-200'}
            Icon={LiaMoneyBillWaveSolid}
            iconSize={'2rem'}
            titleSize={'text-md'}
          />
          <InfoCard
            title={'Clientes Totales'}
            info={activeDebtors.length}
            color={'bg-lime-200'}
            Icon={FiUsers}
            iconSize={'2rem'}
            titleSize={'text-md'}
          />
        </OweActionBar>
        <OweBook>
          <TableOfDebs clientsInfo={activeDebtors} />
        </OweBook>
      </div>

      <span className="bg-gradient-to-b from-transparent via-slate-300 to-transparent rounded-full"></span>

      <div className="rounded-lg relative">
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
