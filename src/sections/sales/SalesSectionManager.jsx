import { useContext } from 'react'
import ProductList from './ProductList.jsx'
import Measure from './Measure.jsx'
import Order from './Order.jsx'
import SalesStorager from './SalesStorager.jsx'
import Notification from '../../comp/Notification.tsx'
import { ManagerContext } from './Manager.jsx'
import SearchClient from './SearchClient.jsx'

const SalesSectionManager = () => {
  const { notification } = useContext(ManagerContext)
  return (
    <section className="mainSection w-full h-full grid">
      <ProductList />
      <div className='grid rows-fit-auto row-span-3 bg-white'>
        <div className="grid cols-1fr-1px-1fr border-b border-slate-200 place-items-center">
          <Measure />
          <span className="w-full h-full bg-slate-300"></span>
          <SalesStorager />
        </div>
        <Order />
      </div>
      <SearchClient />

      <Notification notification={notification} />
    </section>
  )
}

export default SalesSectionManager
