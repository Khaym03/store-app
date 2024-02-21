import { MdAccountBox } from 'react-icons/md'
import { IoMdCash } from 'react-icons/io'
import { URLs } from '../constants'
import { FetchTable } from '../hooks/FetchTable'
import PropTypes from 'prop-types'
import { useContext, useEffect, useState, forwardRef } from 'react'
import { MdPlaylistAddCheck } from 'react-icons/md'
import { IoMdPaper } from 'react-icons/io'
import { OweContext } from './OweProvider'

const NewDebtor = () => {
  return (
    <div className="secondary-container on-secondary-container-text rounded-lg flex justify-center items-center">
      <span className="mr-4">
        <MdAccountBox size={'1.5rem'} />
      </span>
      <span className="text-md capitalize font-medium">Nueva deuda</span>
    </div>
  )
}

const InfoCard = ({ title, info }) => {
  return (
    <div className="tertiary-container on-tertiary-container-text rounded-lg grid grid-rows-2 p-4">
      <div className="flex justify-start">
        <span className="background rounded-lg mr-4 w-10 h-10 grid place-items-center">
          <IoMdCash size={'1.75rem'} />
        </span>
        <span className="font-medium text-base flex items-center">{title}</span>
      </div>
      <div className="text-xl font-medium flex items-center italic">{info}</div>
    </div>
  )
}

InfoCard.propTypes = {
  title: PropTypes.string,
  info: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

const OweActionBar = ({ children }) => {
  return (
    <div className="flex flex-col mb-4">
      <h1 className="capitalize mb-4 font-bold text-3xl">area de deudas</h1>
      <ul className="rounded-lg grid grid-cols-3 w-full h-full gap-4">{children}</ul>
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
    setSelectedClient(clientInfo)
  }

  return (
    <div
      onClick={clickHandler}
      data-client_id={clientInfo[0].id}
      className="cols-2-1-1 grid font-medium text-base capitalize cursor-pointer border-t-2 border-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
    >
      <div className="flex justify-start items-center ml-4">
        <span className="bg-slate-200 w-10 h-10 on-surface-variant-text rounded-lg mr-4 grid place-items-center">
          <MdAccountBox size={'2rem'} />
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
      className={`book-grid grid grid-cols-1 auto-rows-[64px] h-[384px] overflow-y-auto`}
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
    <section className="shadow-sm border-solid border-2 border-slate-100 rounded-lg p-4 w-full h-full">
      <h2 className="capitalize mb-4 text-2xl font-bold">libro de deudores</h2>
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
        <input className='w-6 h-6' type="checkbox" name={name} defaultChecked={false} />
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

let DetailedClient = ({ children, clientName }, ref) => {
  const { selectedClient } = useContext(OweContext)
  const [toggleSelectAll, setToggleSelectAll] = useState(false)

  const selectAll = () => {
    const allCheckBoxs = ref.current.querySelectorAll('input')
    allCheckBoxs.forEach(input => (input.checked = !toggleSelectAll))
    setToggleSelectAll(!toggleSelectAll)
  }

  const updateSaleStatus = () => {
    const selected = Array.from(ref.current.querySelectorAll('input'))

    if (!(selected.length > 0 && selectedClient.length > 0)) return

    const salesToBeProcessed = selected.reduce((acc, currInput, index) => {
      if (currInput.checked) return [...acc, selectedClient[1][index]]
      return acc
    }, [])

    salesToBeProcessed.forEach(sale => {
      fetch(URLs.updateSaleStatusByIDURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: sale.id })
      })
    })
  }

  return (
    <div>
      <h2 className="font-bold text-2xl mb-2">{clientName}</h2>
      <p className="text-sm text-slate-700 font-medium mb-2">
        Selecciona las ventas que quieres borrar de la lista de deudas
      </p>
      <ul ref={ref} className="mb-2 grid auto-rows-[40px] h-[200px] overflow-y-auto">
        {children}
      </ul>
      <div className="grid grid-cols-2 gap-4">
        <button className="transition-colors rounded-lg bg-slate-100 hover:bg-slate-200" onClick={selectAll}>
          <span className="grid place-items-center">
            <MdPlaylistAddCheck size={'1.5rem'} />
          </span>
          <span className="grid place-items-center">Seleccionar todo</span>
        </button>
        <button className="transition-colors  rounded-lg bg-slate-100 hover:bg-slate-200" onClick={updateSaleStatus}>
          <span className="grid place-items-center">
            <IoMdPaper size={'1.5rem'} />
          </span>
          <span className="grid place-items-center">Deuda pagada</span>
        </button>
      </div>
    </div>
  )
}

DetailedClient = forwardRef(DetailedClient)

DetailedClient.propTypes = {
  children: PropTypes.node,
  clientName: PropTypes.string
}

const OweSectionManager = () => {
  const { data: clients } = FetchTable(URLs.getClientsURL)
  const { data: owes } = FetchTable(URLs.getSalesByStatusURL)
  const { data: allDebts } = FetchTable(URLs.getSalesByStatusURL)

  const { selectedClient, detailedClientUlRef } = useContext(OweContext)

  const totalDebts = allDebts
    ? allDebts.reduce((acc, cur) => acc + cur.price, 0)
    : 0

  const [activeDebtors, setActiveDebtors] = useState([])

  useEffect(() => {
    if (clients && owes) {
      const clientsInfo = clients.reduce((acc, currClient) => {
        const findClientOwes = owes.filter(
          sale => sale.foreign_key === currClient.id
        )
        const hasOwes = findClientOwes.length > 0

        return hasOwes ? acc.concat([[currClient, findClientOwes]]) : acc
      }, [])
      setActiveDebtors(clientsInfo)
    }
  }, [clients, owes])

  return (
    <section id="owe-section" className="section grid gap-8 ">
      <div className="flex flex-col">
        <OweActionBar>
          <NewDebtor />
          <InfoCard title={'Deuda Total'} info={totalDebts} />
          <InfoCard title={'Clientes Totales'} info={activeDebtors.length} />
        </OweActionBar>
        <OweBook>
          <TableOfDebs clientsInfo={activeDebtors} />
        </OweBook>
      </div>
      <div className="shadow-sm border-solid border-2 border-slate-100 rounded-lg p-4">
        {selectedClient.length > 0 && (
          <DetailedClient
            clientName={selectedClient[0].name}
            ref={detailedClientUlRef}
          >
            {selectedClient[1].map(({ name, price, date }, i) => (
              <DetailedClientRow
                key={i}
                name={name}
                price={price}
                date={date}
              />
            ))}
          </DetailedClient>
        )}
      </div>
    </section>
  )
}

export default OweSectionManager
