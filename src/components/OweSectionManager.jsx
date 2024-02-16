import { MdAccountBox } from 'react-icons/md'
import { IoMdCash } from 'react-icons/io'
import { URLs } from '../constants'
import { FetchTable } from '../hooks/FetchTable'
import PropTypes from 'prop-types'
import './OweSectionManager.css'
import { useEffect, useState } from 'react'

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
  const clientName = clientInfo[0].name
  const clientOwe = clientInfo[1].reduce((acc, curr) => acc + curr.price, 0)
  const since = clientInfo[1][0].date
  return (
    <div className="client-grid bold text-base capitalize pointer">
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

const OweSectionManager = () => {
  const { data: clients } = FetchTable(URLs.getClientsURL)
  const { data: owes } = FetchTable(URLs.getSalesByStatusURL)
  const { data: allDebts } = FetchTable(URLs.getSalesByStatusURL)

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
      <div className="surface-light"></div>
    </section>
  )
}

export default OweSectionManager
