import PropTypes from 'prop-types'
import { useContext } from 'react'
import { OweContext } from './OweProvider'
import { FiUser } from 'react-icons/fi'


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
        className="cols-2-1-1 grid font-medium text-sm capitalize cursor-pointer border-t border-slate-100 hover:bg-slate-100 text-slate-700 transition-colors"
      >
        <div className="flex justify-start items-center ml-4">
          <span className="rounded-lg mr-4 grid place-items-center">
            <FiUser size={'1.5rem'} />
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

  export default ClientGrid