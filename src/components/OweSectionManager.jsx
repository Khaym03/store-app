import { MdAccountBox } from 'react-icons/md'
import { IoMdCash } from 'react-icons/io'
import { URLs } from '../constants'
import { FetchTable } from '../hooks/FetchTable'
import PropTypes from 'prop-types'
import './OweSectionManager.css'
import { useContext, useEffect, useState, forwardRef } from 'react'
import { MdPlaylistAddCheck } from 'react-icons/md'
import { IoMdPaper } from 'react-icons/io'
import { OweContext } from './OweProvider'

const NewDebtor = () => {
  return (
    <div className="secondary-container on-secondary-container-text rounded-lg flex-center">
      <span className="mr-1">
        <MdAccountBox size={'1.5rem'} />
      </span>
      <span className="text-md capitalize bold">Nueva deuda</span>
    </div>
  )
}

const InfoCard = ({ title, info }) => {
  return (
    <div className="tertiary-container on-tertiary-container-text rounded-lg grid-row-2 p-1">
      <div className="flex-start">
        <span className="background rounded-lg mr-1 square-40 grid-center">
          <IoMdCash size={'1.75rem'} />
        </span>
        <span className="font-medium text-base align-center">{title}</span>
      </div>
      <div className="text-xl font-medium align-center italic">{info}</div>
    </div>
  )
}

InfoCard.propTypes = {
  title: PropTypes.string,
  info: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

const OweActionBar = ({ children }) => {
  return (
    <div className="flex-col mb-1">
      <h1 className="capitalize mb-1">area de deudas</h1>
      <ul className="rounded-lg action-bar full">{children}</ul>
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
      className="client-grid bold text-base capitalize pointer thin-line hover-light"
    >
      <div className="flex-start align-center ml-1">
        <span className="surface-variant on-surface-variant-text rounded-lg mr-1 square-40 grid-center">
          <MdAccountBox size={'2rem'} />
        </span>
        <span>{clientName}</span>
      </div>
      <span className="grid-center italic">{clientOwe.toFixed(2)}</span>
      <span className="grid-center">{since}</span>
    </div>
  )
}

ClientGrid.propTypes = {
  clientInfo: PropTypes.array
}

const BookHeader = () => {
  return (
    <div className="header-grid mb-sm text-base text-semi-transparent capitalize bold">
      <span className="flex-start align-center ml-1">nombre del cliente</span>
      <span className="grid-center">deuda</span>
      <span className="grid-center">desde</span>
    </div>
  )
}

const TableOfDebs = ({ clientsInfo }) => {
  return (
    <div className="book-grid">
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
    <section className="def-border rounded-lg p-1 full">
      <h2 className="capitalize mb-1">libro de deudores</h2>
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
      className="DetailedClientRow thin-line hover-light pointer pointer-events-none"
      onClick={clickhander}
    >
      <span className="grid-center">
        <input type="checkbox" name={name} defaultChecked={false} />
      </span>
      <span className="flex-start align-center capitalize text-sm font-medium">
        {name}
      </span>
      <span className="grid-center text-sm font-medium italic">{price}</span>
      <span className="grid-center">{date}</span>
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

    if(!(selected.length > 0 && selectedClient.length > 0)) return

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
      <h2 className="font-medium mb-sm">{clientName}</h2>
      <p className="text-sm font-semi-transparent font-medium mb-sm">
        Selecciona las ventas que quieres borrar de la lista de deudas
      </p>
      <ul ref={ref} id="DetailedClient-grid" className="mb-sm">
        {children}
      </ul>
      <div className="grid-col-2 gap-1">
        <button className="rounded-lg" onClick={selectAll}>
          <span className="grid-center">
            <MdPlaylistAddCheck size={'1.5rem'} />
          </span>
          <span className="grid-center">Seleccionar todo</span>
        </button>
        <button className="rounded-lg " onClick={updateSaleStatus}>
          <span className="grid-center">
            <IoMdPaper size={'1.5rem'} />
          </span>
          <span className="grid-center">Deuda pagada</span>
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
    <section id="owe-section" className="section ">
      <div className="first-block">
        <OweActionBar>
          <NewDebtor />
          <InfoCard title={'Deuda Total'} info={totalDebts} />
          <InfoCard title={'Clientes Totales'} info={activeDebtors.length} />
        </OweActionBar>
        <OweBook>
          <TableOfDebs clientsInfo={activeDebtors} />
        </OweBook>
      </div>
      <div className="def-border rounded-lg p-1">
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
